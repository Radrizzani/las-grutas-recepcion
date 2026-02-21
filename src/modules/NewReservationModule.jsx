import { useState } from 'react';
import { supabaseClient } from '../utils/supabase';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

export const NewReservationModule = ({ onBack, preselectedUnit = null }) => {
    const [form, setForm] = useState({
        guestName: '',
        city: '',
        province: '',
        dni: '',
        phone: '',
        email: '',
        unitId: preselectedUnit || '',
        checkIn: '',
        checkOut: '',
        adults: 2,
        children: 0,
        notes: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        // TODO: Implementar lógica de guardado en Supabase
        console.log('Guardando reserva:', form);
        
        setTimeout(() => {
            setLoading(false);
            onBack();
        }, 1000);
    };

    const updateField = (field, value) => {
        setForm(f => ({ ...f, [field]: value }));
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-brand-cream">NUEVA RESERVA</h2>
                <Button variant="ghost" onClick={onBack}>← Volver</Button>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Datos del Huésped */}
                    <Card title="Datos del Huésped">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                                    Nombre y Apellido *
                                </label>
                                <input 
                                    type="text" 
                                    required
                                    value={form.guestName}
                                    onChange={(e) => updateField('guestName', e.target.value)}
                                    className="input-high-contrast"
                                    placeholder="Ej: Juan Pérez"
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">DNI</label>
                                    <input 
                                        type="text" 
                                        value={form.dni}
                                        onChange={(e) => updateField('dni', e.target.value)}
                                        className="input-high-contrast"
                                        placeholder="12345678"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Teléfono</label>
                                    <input 
                                        type="tel" 
                                        value={form.phone}
                                        onChange={(e) => updateField('phone', e.target.value)}
                                        className="input-high-contrast"
                                        placeholder="294 1234567"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Email</label>
                                <input 
                                    type="email" 
                                    value={form.email}
                                    onChange={(e) => updateField('email', e.target.value)}
                                    className="input-high-contrast"
                                    placeholder="email@ejemplo.com"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Ciudad</label>
                                    <input 
                                        type="text" 
                                        value={form.city}
                                        onChange={(e) => updateField('city', e.target.value)}
                                        className="input-high-contrast"
                                        placeholder="Ciudad"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Provincia</label>
                                    <input 
                                        type="text" 
                                        value={form.province}
                                        onChange={(e) => updateField('province', e.target.value)}
                                        className="input-high-contrast"
                                        placeholder="Provincia"
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Datos de la Estadía */}
                    <Card title="Datos de la Estadía">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                                    Unidad *
                                </label>
                                <select 
                                    required
                                    value={form.unitId}
                                    onChange={(e) => updateField('unitId', e.target.value)}
                                    className="input-high-contrast"
                                >
                                    <option value="">Seleccionar unidad...</option>
                                    <optgroup label="Cabañas">
                                        {['C1','C2','C3','C4','C5','C6','C7'].map(u => (
                                            <option key={u} value={u}>{u}</option>
                                        ))}
                                    </optgroup>
                                    <optgroup label="Camping">
                                        {Array.from({length: 45}, (_, i) => `P${i + 1}`).map(u => (
                                            <option key={u} value={u}>{u}</option>
                                        ))}
                                    </optgroup>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                                        Check-in *
                                    </label>
                                    <input 
                                        type="date" 
                                        required
                                        value={form.checkIn}
                                        onChange={(e) => updateField('checkIn', e.target.value)}
                                        className="input-high-contrast"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                                        Check-out *
                                    </label>
                                    <input 
                                        type="date" 
                                        required
                                        value={form.checkOut}
                                        onChange={(e) => updateField('checkOut', e.target.value)}
                                        className="input-high-contrast"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Adultos</label>
                                    <input 
                                        type="number" 
                                        min="1"
                                        value={form.adults}
                                        onChange={(e) => updateField('adults', parseInt(e.target.value))}
                                        className="input-high-contrast"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Niños</label>
                                    <input 
                                        type="number" 
                                        min="0"
                                        value={form.children}
                                        onChange={(e) => updateField('children', parseInt(e.target.value))}
                                        className="input-high-contrast"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Notas</label>
                                <textarea 
                                    value={form.notes}
                                    onChange={(e) => updateField('notes', e.target.value)}
                                    className="input-high-contrast"
                                    rows="3"
                                    placeholder="Notas adicionales..."
                                />
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="flex gap-4 mt-6">
                    <Button variant="secondary" className="flex-1" onClick={onBack} type="button">
                        Cancelar
                    </Button>
                    <Button variant="primary" className="flex-1" loading={loading} type="submit">
                        💾 Guardar Reserva
                    </Button>
                </div>
            </form>
        </div>
    );
};
