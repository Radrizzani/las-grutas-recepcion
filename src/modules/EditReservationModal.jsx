import { useState } from 'react'
import { supabaseClient } from '../utils/supabase'

export const EditReservationModal = ({ reservation, units, onClose, onSuccess }) => {
    const guestData = reservation?.guest || {}
    
    const [form, setForm] = useState({
        guestName: guestData.full_name || '',
        city: guestData.city || '',
        province: guestData.province || '',
        country: guestData.country || 'Argentina',
        unitId: reservation?.unit_id || '',
        checkIn: reservation?.check_in || '',
        checkOut: reservation?.check_out || '',
        ordenEstada: reservation?.orden_estada || '',
        paxTotal: reservation?.pax_total || 1,
        paxAfiliados: reservation?.pax_afiliados || 0,
        paxConvenio: reservation?.pax_convenio || 0,
        paxPasantes: reservation?.pax_pasantes || 0,
        notes: reservation?.notes || ''
    })
    
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const updateForm = (field, value) => setForm(f => ({ ...f, [field]: value }))

    const handleSave = async () => {
        setLoading(true)
        setError('')

        try {
            const { error: guestError } = await supabaseClient
                .from('guests')
                .update({
                    full_name: form.guestName,
                    city: form.city,
                    province: form.province,
                    country: form.country
                })
                .eq('id', reservation.guest_id)

            if (guestError) throw guestError

            const { error: resError } = await supabaseClient
                .from('reservations')
                .update({
                    unit_id: form.unitId,
                    check_in: form.checkIn,
                    check_out: form.checkOut,
                    orden_estada: form.ordenEstada ? parseInt(form.ordenEstada) : null,
                    pax_total: parseInt(form.paxTotal),
                    pax_afiliados: parseInt(form.paxAfiliados),
                    pax_convenio: parseInt(form.paxConvenio),
                    pax_pasantes: parseInt(form.paxPasantes),
                    notes: form.notes
                })
                .eq('id', reservation.id)

            if (resError) {
                if (resError.message.includes('SOLAPAMIENTO') || resError.message.includes('overlap')) {
                    throw new Error('La unidad ya está ocupada en esas fechas')
                }
                throw resError
            }

            onSuccess()
            
        } catch (err) {
            setError(err.message)
            setLoading(false)
        }
    }

    const cabanas = units.filter(u => u.type === 'cabana')
    const campings = units.filter(u => u.type === 'camping')
    const isCheckedIn = reservation?.status === 'checked_in'

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-brand-cream rounded-xl shadow-2xl max-w-2xl w-full border-2 border-brand-midblue animate-fade-in max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                
                <div className="px-6 py-4 bg-brand-darkblue border-b border-brand-midblue flex justify-between items-center">
                    <h3 className="text-lg font-bold text-brand-cream uppercase">
                        {isCheckedIn ? 'Editar Ocupación' : 'Editar Reserva'}
                    </h3>
                    <button onClick={onClose} className="text-brand-cream hover:text-white text-2xl">×</button>
                </div>

                <div className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-100 border-2 border-red-500 text-red-700 p-3 rounded-lg font-bold text-sm">
                            ⚠️ {error}
                        </div>
                    )}

                    <div className="bg-white p-4 rounded-lg border border-brand-midblue">
                        <h4 className="font-bold text-brand-midblue mb-3 uppercase text-sm">Datos del Huésped</h4>
                        
                        <div className="mb-3">
                            <label className="block text-xs font-bold text-brand-darkblue uppercase mb-1">Nombre completo</label>
                            <input type="text" value={form.guestName} onChange={(e) => updateForm('guestName', e.target.value)} className="input-high-contrast" />
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <label className="block text-xs font-bold text-brand-darkblue uppercase mb-1">Ciudad</label>
                                <input type="text" value={form.city} onChange={(e) => updateForm('city', e.target.value)} className="input-high-contrast" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-brand-darkblue uppercase mb-1">Provincia</label>
                                <input type="text" value={form.province} onChange={(e) => updateForm('province', e.target.value)} className="input-high-contrast" placeholder="Ej: Río Negro" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-brand-darkblue uppercase mb-1">País</label>
                                <input type="text" value={form.country} onChange={(e) => updateForm('country', e.target.value)} className="input-high-contrast" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-brand-midblue">
                        <h4 className="font-bold text-brand-midblue mb-3 uppercase text-sm">Unidad y Fechas</h4>
                        
                        <div className="mb-3">
                            <label className="block text-xs font-bold text-brand-darkblue uppercase mb-1">Unidad</label>
                            <select value={form.unitId} onChange={(e) => updateForm('unitId', e.target.value)} className="input-high-contrast" disabled={isCheckedIn}>
                                <option value="">Seleccionar unidad...</option>
                                {cabanas.length > 0 && (
                                    <optgroup label="Cabañas">
                                        {cabanas.map(u => <option key={u.id} value={u.id}>{u.name || u.id} (Cap: {u.capacity})</option>)}
                                    </optgroup>
                                )}
                                {campings.length > 0 && (
                                    <optgroup label="Camping">
                                        {campings.map(u => <option key={u.id} value={u.id}>{u.name || u.id} (Cap: {u.capacity})</option>)}
                                    </optgroup>
                                )}
                            </select>
                            {isCheckedIn && <p className="text-xs text-orange-600 mt-1">⚠️ No se puede cambiar la unidad después del check-in</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-brand-darkblue uppercase mb-1">Entrada {isCheckedIn && '(Realizado)'}</label>
                                <input type="date" value={form.checkIn} onChange={(e) => updateForm('checkIn', e.target.value)} className="input-high-contrast" disabled={isCheckedIn} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-brand-darkblue uppercase mb-1">Salida</label>
                                <input type="date" value={form.checkOut} onChange={(e) => updateForm('checkOut', e.target.value)} className="input-high-contrast" min={form.checkIn} />
                            </div>
                        </div>

                        <div className="mt-3">
                            <label className="block text-xs font-bold text-brand-darkblue uppercase mb-1">Orden de Estadía N° (Opcional)</label>
                            <input type="number" value={form.ordenEstada} onChange={(e) => updateForm('ordenEstada', e.target.value)} className="input-high-contrast" placeholder="Ej: 1234" />
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-brand-midblue">
                        <h4 className="font-bold text-brand-midblue mb-3 uppercase text-sm">Distribución de Pasajeros</h4>
                        
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-brand-darkblue uppercase mb-1">Total</label>
                                <input type="number" min="1" value={form.paxTotal} onChange={(e) => updateForm('paxTotal', e.target.value)} className="input-high-contrast" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-brand-darkblue uppercase mb-1">Afiliados</label>
                                <input type="number" min="0" value={form.paxAfiliados} onChange={(e) => updateForm('paxAfiliados', e.target.value)} className="input-high-contrast" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-brand-darkblue uppercase mb-1">Convenio</label>
                                <input type="number" min="0" value={form.paxConvenio} onChange={(e) => updateForm('paxConvenio', e.target.value)} className="input-high-contrast" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-brand-darkblue uppercase mb-1">Pasantes</label>
                                <input type="number" min="0" value={form.paxPasantes} onChange={(e) => updateForm('paxPasantes', e.target.value)} className="input-high-contrast" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-brand-midblue">
                        <label className="block text-xs font-bold text-brand-midblue uppercase mb-1">Notas / Observaciones</label>
                        <textarea value={form.notes} onChange={(e) => updateForm('notes', e.target.value)} className="input-high-contrast w-full h-20 resize-none" placeholder="Información adicional sobre la reserva..." />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button onClick={onClose} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-lg uppercase transition-colors" disabled={loading}>
                            Cancelar
                        </button>
                        <button onClick={handleSave} disabled={loading || !form.guestName || !form.unitId || !form.checkIn || !form.checkOut} className="flex-1 bg-brand-midblue hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            {loading ? '💾 Guardando...' : '💾 Guardar Cambios'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
