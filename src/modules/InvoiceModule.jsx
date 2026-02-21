import { useState, useEffect } from 'react';
import { supabaseClient } from '../utils/supabase';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { formatCurrency, getToday } from '../utils/helpers';

export const InvoiceModule = ({ reservation, onBack }) => {
    const [form, setForm] = useState({
        guestName: reservation?.guest?.full_name || '',
        city: reservation?.guest?.city || '',
        province: reservation?.guest?.province || '',
        unitId: reservation?.unit_id || '',
        checkIn: reservation?.check_in || '',
        checkOut: reservation?.check_out || '',
        nights: 0,
        items: [],
        payments: {
            adelanto: 0,
            financiacion: 0,
            efectivo: 0,
            transferencia: 0,
            debito: 0,
            credito: 0,
            subvencion: 0,
            promo: 0
        }
    });

    useEffect(() => {
        if (reservation?.check_in && reservation?.check_out) {
            const start = new Date(reservation.check_in);
            const end = new Date(reservation.check_out);
            const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
            setForm(f => ({ ...f, nights }));
            
            // Auto-generar items de alojamiento
            const items = [];
            for (let i = 0; i < nights; i++) {
                const date = new Date(start);
                date.setDate(date.getDate() + i);
                items.push({
                    date: date.toISOString().split('T')[0],
                    concept: 'ALOJAMIENTO',
                    price: 15000 // TODO: obtener de season_rates
                });
            }
            setForm(f => ({ ...f, items }));
        }
    }, [reservation]);

    const total = form.items.reduce((sum, item) => sum + item.price, 0);
    const totalPaid = Object.values(form.payments).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
    const difference = total - totalPaid;

    const updatePayment = (field, value) => {
        setForm(f => ({
            ...f,
            payments: { ...f.payments, [field]: parseFloat(value) || 0 }
        }));
    };

    return (
        <div className="max-w-6xl mx-auto animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-brand-cream">NUEVA FACTURA</h2>
                <Button variant="ghost" onClick={onBack}>← Volver</Button>
            </div>

            {/* Alerta de sistema bloqueado */}
            <div className="bg-red-100 border-2 border-red-500 text-red-700 p-3 rounded-lg mb-6 flex items-center gap-2">
                <span className="text-xl">🔒</span>
                <span className="font-bold">SISTEMA BLOQUEADO:</span>
                <span>Puede ver y buscar, pero no guardar facturas. Desbloquee con el candado superior.</span>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* COLUMNA IZQUIERDA */}
                <div className="space-y-4">
                    {/* Datos de factura */}
                    <Card title="Datos de Factura">
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">N° Factura</label>
                                <div className="flex gap-2">
                                    <input type="text" placeholder="Ej: 16256" className="input-high-contrast" />
                                    <button className="bg-brand-midblue text-white px-3 rounded-lg">🔍</button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Fecha Emisión</label>
                                <input type="date" defaultValue={getToday()} className="input-high-contrast" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Estado</label>
                                <select className="input-high-contrast">
                                    <option>Emitida</option>
                                    <option>Pagada</option>
                                    <option>Anulada</option>
                                </select>
                            </div>
                        </div>
                    </Card>

                    {/* Datos del cliente */}
                    <Card title="Datos del Cliente">
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Nombre y Apellido</label>
                                <input 
                                    type="text" 
                                    value={form.guestName}
                                    onChange={(e) => setForm(f => ({ ...f, guestName: e.target.value }))}
                                    className="input-high-contrast"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Domicilio / Ciudad</label>
                                    <input type="text" value={form.city} className="input-high-contrast" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Provincia</label>
                                    <input type="text" value={form.province} className="input-high-contrast" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">C.U.I.T.</label>
                                    <input type="text" className="input-high-contrast" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Orden de Estada</label>
                                    <input type="text" className="input-high-contrast" />
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Datos de estadía */}
                    <Card title="Datos de Estadía">
                        <div className="grid grid-cols-2 gap-3 mb-3">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Fecha Desde</label>
                                <input type="date" value={form.checkIn} className="input-high-contrast" readOnly />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Fecha Hasta</label>
                                <input type="date" value={form.checkOut} className="input-high-contrast" readOnly />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Unidad</label>
                                <input type="text" value={form.unitId} className="input-high-contrast bg-gray-100" readOnly />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Sector</label>
                                <input type="text" value={form.unitId?.startsWith('C') ? 'Cabañas' : 'Camping'} className="input-high-contrast bg-gray-100" readOnly />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Noches</label>
                                <input type="text" value={form.nights} className="input-high-contrast bg-gray-100" readOnly />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* COLUMNA DERECHA */}
                <div className="space-y-4">
                    {/* Detalle de conceptos */}
                    <Card title="Detalle de Conceptos" headerAction={
                        <Button variant="secondary" className="!py-1 !px-2 text-xs">
                            + Agregar Item
                        </Button>
                    }>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-brand-darkblue text-white">
                                    <tr>
                                        <th className="p-2 text-left">Fecha</th>
                                        <th className="p-2 text-left">Concepto</th>
                                        <th className="p-2 text-right">P. Unit</th>
                                        <th className="p-2 text-center">Cant</th>
                                        <th className="p-2 text-right">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {form.items.map((item, idx) => (
                                        <tr key={idx} className="border-b border-gray-200">
                                            <td className="p-2">{item.date}</td>
                                            <td className="p-2">{item.concept}</td>
                                            <td className="p-2 text-right">{formatCurrency(item.price)}</td>
                                            <td className="p-2 text-center">1</td>
                                            <td className="p-2 text-right font-bold">{formatCurrency(item.price)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-3 text-right">
                            <span className="text-gray-600">Total Facturado: </span>
                            <span className="text-xl font-black text-brand-darkblue">{formatCurrency(total)}</span>
                        </div>
                    </Card>

                    {/* Forma de pago */}
                    <Card title="Forma de Pago">
                        <div className="grid grid-cols-2 gap-3">
                            {Object.entries({
                                adelanto: 'Adelanto / Orden Estada',
                                financiacion: 'Financiación',
                                efectivo: 'Efectivo',
                                transferencia: 'Transferencia',
                                debito: 'Tarjeta Débito',
                                credito: 'Tarjeta Crédito',
                                subvencion: 'Subvención ISSN',
                                promo: 'Promoción'
                            }).map(([key, label]) => (
                                <div key={key}>
                                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">{label}</label>
                                    <input 
                                        type="number" 
                                        value={form.payments[key]}
                                        onChange={(e) => updatePayment(key, e.target.value)}
                                        className="input-high-contrast"
                                    />
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Totales */}
                    <div className="bg-brand-darkblue text-white rounded-xl p-6 shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-lg">TOTAL A CANCELAR</span>
                            <span className="text-3xl font-black">{formatCurrency(total)}</span>
                        </div>
                        <div className="border-t border-white/20 pt-4 space-y-2">
                            <div className="flex justify-between text-brand-midblue">
                                <span>Total Ingresado</span>
                                <span className="text-xl font-bold">{formatCurrency(totalPaid)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className={difference > 0 ? 'text-red-400' : 'text-green-400'}>
                                    {difference > 0 ? 'FALTANTE' : 'DIFERENCIA'}
                                </span>
                                <span className={`text-2xl font-black ${difference > 0 ? 'text-red-400' : 'text-green-400'}`}>
                                    {formatCurrency(Math.abs(difference))}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3">
                        <Button variant="secondary" className="flex-1" onClick={onBack}>
                            Cancelar
                        </Button>
                        <Button variant="primary" className="flex-1">
                            🖨️ Imprimir Factura A4
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
