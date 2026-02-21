import { useState, useEffect } from 'react'
import { supabaseClient } from '../utils/supabase'
import { getToday, getStatusColor, getStatusText, formatCurrency } from '../utils/helpers'
import { Card } from '../components/Card'
import { Badge } from '../components/Badge'

export const DashboardHome = ({ onNavigate, onCreateInvoice }) => {
    const [today] = useState(getToday())
    const [units, setUnits] = useState([])
    const [reservations, setReservations] = useState([])
    const [stats, setStats] = useState({
        occupiedCabanas: 0,
        occupiedCamping: 0,
        checkinsToday: 0,
        checkoutsToday: 0,
        pendingInvoices: 0,
        todayRevenue: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadDashboardData()
        const interval = setInterval(loadDashboardData, 30000)
        return () => clearInterval(interval)
    }, [])

    const loadDashboardData = async () => {
        try {
            const { data: unitsData } = await supabaseClient.from('units').select('*').order('id')
            setUnits(unitsData || [])

            const { data: resData } = await supabaseClient
                .from('reservations')
                .select('*, guest:guests(full_name, city, province)')
                .or(`status.eq.checked_in,and(check_in.lte.${today},check_out.gt.${today})`)
                .order('unit_id')

            setReservations(resData || [])

            const occupied = resData?.filter(r => r.status === 'checked_in') || []
            const checkinsToday = resData?.filter(r => r.check_in === today && r.status !== 'checked_in') || []
            const checkoutsToday = resData?.filter(r => r.check_out === today) || []

            setStats({
                occupiedCabanas: occupied.filter(r => r.unit_id.startsWith('C')).length,
                occupiedCamping: occupied.filter(r => r.unit_id.startsWith('P')).length,
                checkinsToday: checkinsToday.length,
                checkoutsToday: checkoutsToday.length,
                pendingInvoices: 0,
                todayRevenue: 0
            })

            setLoading(false)
        } catch (err) {
            console.error('Error loading dashboard:', err)
            setLoading(false)
        }
    }

    const cabanas = units.filter(u => u.type === 'cabana')
    const camping = units.filter(u => u.type === 'camping')

    const getReservationForUnit = (unitId) => reservations.find(r => r.unit_id === unitId)

    const handleUnitClick = (unit, reservation) => {
        if (reservation) {
            if (reservation.status === 'checked_in') {
                onCreateInvoice(reservation)
            } else {
                onNavigate('checkin', { reservation })
            }
        } else {
            onNavigate('new-reservation', { unitId: unit.id })
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-midblue"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <Card className="!p-0">
                    <div className="p-4 text-center">
                        <div className="text-3xl font-black text-brand-red">{stats.occupiedCabanas}</div>
                        <div className="text-xs text-gray-600 uppercase font-bold">Cabañas Ocupadas</div>
                        <div className="text-xs text-gray-500">de {cabanas.length}</div>
                    </div>
                </Card>
                <Card className="!p-0">
                    <div className="p-4 text-center">
                        <div className="text-3xl font-black text-brand-midblue">{stats.occupiedCamping}</div>
                        <div className="text-xs text-gray-600 uppercase font-bold">Camping Ocupado</div>
                        <div className="text-xs text-gray-500">de {camping.length}</div>
                    </div>
                </Card>
                <Card className="!p-0">
                    <div className="p-4 text-center">
                        <div className="text-3xl font-black text-green-600">{stats.checkinsToday}</div>
                        <div className="text-xs text-gray-600 uppercase font-bold">Check-ins Hoy</div>
                        <div className="text-xs text-gray-500">{today}</div>
                    </div>
                </Card>
                <Card className="!p-0">
                    <div className="p-4 text-center">
                        <div className="text-3xl font-black text-brand-orange">{stats.checkoutsToday}</div>
                        <div className="text-xs text-gray-600 uppercase font-bold">Check-outs Hoy</div>
                        <div className="text-xs text-gray-500">Salidas</div>
                    </div>
                </Card>
                <Card className="!p-0">
                    <div className="p-4 text-center">
                        <div className="text-3xl font-black text-purple-600">{stats.pendingInvoices}</div>
                        <div className="text-xs text-gray-600 uppercase font-bold">S/FACT</div>
                        <div className="text-xs text-gray-500">Sin facturar</div>
                    </div>
                </Card>
                <Card className="!p-0">
                    <div className="p-4 text-center">
                        <div className="text-3xl font-black text-blue-600">{formatCurrency(stats.todayRevenue)}</div>
                        <div className="text-xs text-gray-600 uppercase font-bold">Caja Hoy</div>
                        <div className="text-xs text-gray-500">Facturado</div>
                    </div>
                </Card>
            </div>

            <Card 
                title={`CABAÑAS - Estado Actual (${stats.occupiedCabanas}/${cabanas.length} Ocupadas)`}
                headerAction={
                    <Badge variant={stats.occupiedCabanas === cabanas.length ? 'danger' : 'success'}>
                        {stats.occupiedCabanas === cabanas.length ? 'COMPLETO' : 'DISPONIBLE'}
                    </Badge>
                }
            >
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                    {cabanas.map(unit => {
                        const reservation = getReservationForUnit(unit.id)
                        const statusClass = getStatusColor(reservation, today)
                        const statusText = getStatusText(reservation, today)
                        
                        return (
                            <div 
                                key={unit.id}
                                onClick={() => handleUnitClick(unit, reservation)}
                                className={`${statusClass} rounded-lg p-3 cursor-pointer card-hover relative overflow-hidden`}
                            >
                                <div className="font-black text-lg">{unit.id}</div>
                                <div className="text-xs font-bold opacity-90 truncate">
                                    {reservation?.guest?.full_name || 'Libre'}
                                </div>
                                <div className="text-[10px] mt-1 opacity-75">
                                    {reservation ? `${reservation.check_out?.slice(5)}` : 'Disponible'}
                                </div>
                                {reservation?.status === 'checked_in' && (
                                    <div className="absolute top-1 right-1"><span className="text-xs">💵</span></div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </Card>

            <Card 
                title={`CAMPING - Estado Actual (${stats.occupiedCamping}/${camping.length} Ocupadas)`}
                headerAction={
                    <Badge variant={stats.occupiedCamping === camping.length ? 'danger' : 'success'}>
                        {stats.occupiedCamping === camping.length ? 'COMPLETO' : 'DISPONIBLE'}
                    </Badge>
                }
            >
                <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-9 lg:grid-cols-12 gap-2">
                    {camping.map(unit => {
                        const reservation = getReservationForUnit(unit.id)
                        const statusClass = getStatusColor(reservation, today)
                        
                        return (
                            <div 
                                key={unit.id}
                                onClick={() => handleUnitClick(unit, reservation)}
                                className={`${statusClass} rounded-lg p-2 cursor-pointer card-hover text-center`}
                            >
                                <div className="font-black text-sm">{unit.id}</div>
                                <div className="text-[10px] font-bold truncate">
                                    {reservation?.guest?.full_name?.split(',')[0] || '-'}
                                </div>
                                {reservation?.status === 'checked_in' && <div className="text-[10px] mt-1">💵</div>}
                            </div>
                        )
                    })}
                </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
                <Card title="📥 Próximos Check-ins (Hoy)">
                    {reservations.filter(r => r.check_in === today && r.status !== 'checked_in').length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No hay check-ins programados para hoy</p>
                    ) : (
                        <div className="space-y-2">
                            {reservations
                                .filter(r => r.check_in === today && r.status !== 'checked_in')
                                .map(r => (
                                    <div key={r.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-green-200">
                                        <div>
                                            <div className="font-bold text-brand-darkblue">{r.guest?.full_name}</div>
                                            <div className="text-sm text-gray-600">{r.unit_id} • {r.nights || '?' } noches</div>
                                        </div>
                                        <button onClick={() => onNavigate('checkin', { reservation: r })} className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm font-bold hover:bg-green-600">
                                            Check-in
                                        </button>
                                    </div>
                                ))}
                        </div>
                    )}
                </Card>

                <Card title="📤 Check-outs de Hoy">
                    {reservations.filter(r => r.check_out === today).length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No hay check-outs programados para hoy</p>
                    ) : (
                        <div className="space-y-2">
                            {reservations
                                .filter(r => r.check_out === today)
                                .map(r => (
                                    <div key={r.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-orange-200">
                                        <div>
                                            <div className="font-bold text-brand-darkblue">{r.guest?.full_name}</div>
                                            <div className="text-sm text-gray-600">{r.unit_id} • Salida hoy</div>
                                        </div>
                                        <button onClick={() => onCreateInvoice(r)} className="px-3 py-1 bg-brand-orange text-white rounded-lg text-sm font-bold hover:bg-orange-600">
                                            Facturar
                                        </button>
                                    </div>
                                ))}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    )
}
