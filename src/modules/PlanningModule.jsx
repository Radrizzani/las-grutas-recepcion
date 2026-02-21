import { useState, useEffect } from 'react';
import { supabaseClient } from '../utils/supabase';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

export const PlanningModule = ({ onBack }) => {
    const [units, setUnits] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        // TODO: Cargar unidades y reservas para el planning
        const { data: unitsData } = await supabaseClient
            .from('units')
            .select('*')
            .order('id');
        
        setUnits(unitsData || []);
    };

    const getDaysInMonth = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        return Array.from({ length: days }, (_, i) => i + 1);
    };

    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                       'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    return (
        <div className="max-w-7xl mx-auto animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-brand-cream">
                    PLANNING - {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1))}>
                        ← Mes Anterior
                    </Button>
                    <Button variant="ghost" onClick={() => setCurrentDate(new Date())}>
                        Hoy
                    </Button>
                    <Button variant="ghost" onClick={() => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1))}>
                        Mes Siguiente →
                    </Button>
                    <Button variant="ghost" onClick={onBack}>Volver</Button>
                </div>
            </div>

            <Card title="Vista de Ocupación">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-brand-darkblue text-white">
                                <th className="p-2 sticky left-0 bg-brand-darkblue">Unidad</th>
                                {getDaysInMonth().map(day => (
                                    <th key={day} className="p-2 min-w-[40px]">{day}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {units.map(unit => (
                                <tr key={unit.id} className="border-b border-gray-200">
                                    <td className="p-2 font-bold sticky left-0 bg-white">{unit.id}</td>
                                    {getDaysInMonth().map(day => (
                                        <td key={day} className="p-2 text-center">
                                            <div className="w-full h-6 bg-green-100 rounded"></div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="mt-4 text-center text-gray-500">
                    📝 Planning visual en desarrollo - Aquí se mostrará la ocupación por día
                </p>
            </Card>
        </div>
    );
};
