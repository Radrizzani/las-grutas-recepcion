import { useState, useEffect, useMemo } from 'react';
import { supabaseClient } from '../utils/supabase';
import { addDays, getToday, isToday, isPast, formatDisplay, getDayName } from '../utils/helpers';
import { ReservationModal } from './ReservationModal';
import { CheckInForm } from './CheckInForm';
import { EditReservationModal } from './EditReservationModal';

export const PlanningModule = ({ onBack }) => {
    const [startDate, setStartDate] = useState(() => addDays(getToday(), -3));
    const [daysToShow, setDaysToShow] = useState(14);
    const [filter, setFilter] = useState('all');
    const [units, setUnits] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedReservation, setSelectedReservation] = useState(null);
    const [showCheckInForm, setShowCheckInForm] = useState(false);
    const [reservationForCheckIn, setReservationForCheckIn] = useState(null);
    const [editingReservation, setEditingReservation] = useState(null);

    const endDate = useMemo(() => addDays(startDate, daysToShow), [startDate, daysToShow]);
    const dates = useMemo(() => {
        const arr = [];
        for (let i = 0; i < daysToShow; i++) arr.push(addDays(startDate, i));
        return arr;
    }, [startDate, daysToShow]);

    useEffect(() => {
        loadData();
        const channel = supabaseClient
            .channel('planning-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'reservations' }, () => loadData())
            .subscribe();
        return () => { supabaseClient.removeChannel(channel); };
    }, [startDate, daysToShow]);

    const loadData = async () => {
        setLoading(true);
        try {
            const { data: unitsData } = await supabaseClient.from('units').select('*').order('id');
            setUnits(unitsData || []);

            const { data: resData } = await supabaseClient
                .from('reservations')
                .select(`*, guest:guests(*), guest_id`)
                .gte('check_out', startDate)
                .lte('check_in', endDate)
                .in('status', ['confirmed', 'checked_in'])
                .order('check_in');

            setReservations(resData || []);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const { error } = await supabaseClient.from('reservations').delete().eq('id', id);
        if (error) alert('Error eliminando: ' + error.message);
        else loadData();
    };

    const handleCheckIn = (reservation) => {
        setReservationForCheckIn(reservation);
        setShowCheckInForm(true);
    };

    const handleCheckInSuccess = () => {
        setShowCheckInForm(false);
        setReservationForCheckIn(null);
        loadData();
    };

    const handleEdit = (reservation) => {
        setEditingReservation(reservation);
    };

    const handleEditSuccess = () => {
        setEditingReservation(null);
        loadData();
    };

    const filteredUnits = useMemo(() => {
        if (filter === 'all') return units;
        return units.filter(u => u.type === filter);
    }, [units, filter]);

    const getReservationForCell = (unitId, dateStr) => {
        return reservations.find(r => r.unit_id === unitId && dateStr >= r.check_in && dateStr < r.check_out);
    };

    const goToday = () => setStartDate(addDays(getToday(), -3));
    const goPrev = () => setStartDate(addDays(startDate, -7));
    const goNext = () => setStartDate(addDays(startDate, 7));

    const renderReservationBar = (res, dateStr) => {
        const isFirstDay = dateStr === res.check_in || dateStr === dates[0];
        if (!isFirstDay) return null;

        let visibleDays = 0;
        for (let i = dates.indexOf(dateStr); i < dates.length; i++) {
            if (dates[i] < res.check_out) visibleDays++;
            else break;
        }
        if (visibleDays === 0) return null;

        const today = getToday();
        let bgClass, textClass;
        if (res.status === 'checked_in') {
            bgClass = 'bg-[#FF6B75]'; textClass = 'text-white';
        } else if (res.check_in <= today) {
            bgClass = 'bg-[#87B867]'; textClass = 'text-white';
        } else {
            bgClass = 'bg-yellow-400'; textClass = 'text-brand-darkblue';
        }

        return (
            <div
                className={`absolute top-1 left-1 h-[calc(100%-4px)] rounded shadow-md flex items-center px-2 text-[10px] font-bold uppercase whitespace-nowrap overflow-hidden cursor-pointer hover:brightness-110 hover:scale-[1.02] z-10 transition-all ${bgClass} ${textClass}`}
                style={{ width: `calc(${visibleDays * 100}% - 4px)` }}
                title={`${res.guest?.full_name || 'Sin nombre'} (${res.check_in} a ${res.check_out})`}
                onClick={() => setSelectedReservation(res)}
            >
                <span className="truncate">{res.guest?.full_name || 'Sin nombre'}</span>
            </div>
        );
    };

    if (loading && units.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-midblue"></div>
            </div>
        );
    }

    return (
        <>
            {selectedReservation && (
                <ReservationModal
                    reservation={selectedReservation}
                    onClose={() => setSelectedReservation(null)}
                    onCheckIn={handleCheckIn}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                />
            )}

            {showCheckInForm && reservationForCheckIn && (
                <CheckInForm
                    reservation={reservationForCheckIn}
                    onClose={() => setShowCheckInForm(false)}
                    onSuccess={handleCheckInSuccess}
                />
            )}

            {editingReservation && (
                <EditReservationModal
                    reservation={editingReservation}
                    units={units}
                    onClose={() => setEditingReservation(null)}
                    onSuccess={handleEditSuccess}
                />
            )}

            <div className="h-[calc(100vh-80px)] flex flex-col bg-white border border-brand-midblue rounded-lg shadow-xl overflow-hidden animate-fade-in">

                {/* HEADER */}
                <div className="bg-brand-darkblue px-4 py-3 flex flex-wrap items-center justify-between gap-2 border-b border-brand-midblue shrink-0">
                    <div className="flex items-center gap-3">
                        <h2 className="text-sm font-black text-brand-cream uppercase hidden sm:block">Planning</h2>
                        <div className="flex bg-white/10 rounded p-1 gap-1">
                            {['all', 'cabana', 'camping'].map(f => (
                                <button key={f} onClick={() => setFilter(f)}
                                    className={`px-3 py-1.5 text-xs font-bold rounded ${filter === f ? 'bg-brand-cream text-brand-darkblue' : 'text-white hover:bg-white/20'}`}>
                                    {f === 'all' ? 'TODO' : f.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={goToday} className="px-3 py-1.5 bg-white/10 text-white rounded text-xs font-bold hover:bg-white/20">HOY</button>
                        <button onClick={goPrev} className="p-2 text-white hover:bg-white/20 rounded">←</button>
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                            className="bg-brand-cream text-brand-darkblue font-bold px-2 py-1.5 text-sm rounded w-32 text-center" />
                        <button onClick={goNext} className="p-2 text-white hover:bg-white/20 rounded">→</button>
                        <select value={daysToShow} onChange={(e) => setDaysToShow(Number(e.target.value))}
                            className="bg-brand-cream text-brand-darkblue font-bold px-2 py-1.5 text-sm rounded">
                            <option value={14}>14 días</option>
                            <option value={21}>21 días</option>
                            <option value={30}>30 días</option>
                        </select>
                        <button onClick={onBack} className="px-3 py-1.5 bg-white/10 text-white rounded text-xs font-bold hover:bg-white/20">
                            ← Volver
                        </button>
                    </div>
                </div>

                {/* TABLA */}
                <div className="flex-1 overflow-auto bg-gray-50">
                    <table className="border-collapse w-full">
                        <thead className="sticky top-0 z-20">
                            <tr>
                                <th className="sticky left-0 z-30 bg-brand-darkblue text-brand-cream w-16 border-r border-brand-midblue text-xs font-bold py-2">Und</th>
                                {dates.map(dateStr => {
                                    const today = isToday(dateStr);
                                    const weekend = [0, 6].includes(new Date(dateStr + 'T00:00:00').getDay());
                                    return (
                                        <th key={dateStr} className={`min-w-[40px] border-b border-r text-center text-xs py-1 ${today ? 'bg-green-500 text-white' : weekend ? 'bg-brand-midblue/20 text-brand-darkblue' : 'bg-white text-brand-darkblue'}`}>
                                            <div className="font-bold opacity-70">{getDayName(dateStr)}</div>
                                            <div className="font-black text-base">{formatDisplay(dateStr)}</div>
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUnits.map((unit, idx) => (
                                <tr key={unit.id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50`}>
                                    <td className="sticky left-0 z-10 bg-brand-darkblue text-white font-bold text-center border-r border-b border-brand-midblue text-sm py-2">{unit.id}</td>
                                    {dates.map(dateStr => {
                                        const today = isToday(dateStr);
                                        const past = isPast(dateStr);
                                        const res = getReservationForCell(unit.id, dateStr);
                                        return (
                                            <td key={dateStr} className={`relative border-b border-r border-gray-200 h-8 min-w-[40px] ${past ? 'bg-gray-200/50' : ''} ${today ? 'bg-green-100' : ''}`}>
                                                {res && renderReservationBar(res, dateStr)}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* FOOTER / LEYENDA */}
                <div className="bg-brand-darkblue px-4 py-2 border-t border-brand-midblue shrink-0">
                    <div className="flex items-center gap-6 text-xs text-brand-cream">
                        <span className="font-bold">Leyenda:</span>
                        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-yellow-400 rounded"></div><span>Reserva</span></div>
                        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-[#87B867] rounded"></div><span>Check-in hoy</span></div>
                        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-[#FF6B75] rounded"></div><span>Ocupado</span></div>
                        <div className="ml-auto">{filteredUnits.length} unidades</div>
                    </div>
                </div>
            </div>
        </>
    );
};
