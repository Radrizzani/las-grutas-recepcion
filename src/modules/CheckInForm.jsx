import { useState } from 'react'
import { supabaseClient } from '../utils/supabase'
import { calculateDays } from '../utils/helpers'

export const CheckInForm = ({ reservation, onClose, onSuccess }) => {
    const guestData = reservation?.guest || {}
    
    const [form, setForm] = useState({
        fullName: guestData.full_name || '',
        city: guestData.city || '',
        province: guestData.province || '',
        country: guestData.country || 'Argentina',
        ordenEstada: reservation?.orden_estada || '',
        paxTotal: reservation?.pax_total || 1,
        paxAfiliados: reservation?.pax_afiliados || 0,
        paxConvenio: reservation?.pax_convenio || 0,
        paxPasantes: reservation?.pax_pasantes || 0,
        notes: reservation?.notes || ''
    })
    
    const [loading, setLoading] = useState(false)

    const updateForm = (field, value) => setForm(f => ({ ...f, [field]: value }))

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { error: guestError } = await supabaseClient
                .from('guests')
                .update({
                    full_name: form.fullName,
                    city: form.city,
                    province: form.province,
                    country: form.country
                })
                .eq('id', reservation.guest_id)

            if (guestError) throw guestError

            const { error: resError } = await supabaseClient
                .from('reservations')
                .update({
                    status: 'checked_in',
                    orden_estada: form.ordenEstada ? parseInt(form.ordenEstada) : null,
                    pax_total: parseInt(form.paxTotal),
                    pax_afiliados: parseInt(form.paxAfiliados),
                    pax_convenio: parseInt(form.paxConvenio),
                    pax_pasantes: parseInt(form.paxPasantes),
                    notes: form.notes
                })
                .eq('id', reservation.id)

            if (resError) throw resError

            alert('✅ Check-in realizado correctamente')
            onSuccess()
            
        } catch (err) {
            alert('Error: ' + err.message)
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-brand-cream rounded-xl shadow-2xl max-w-lg w-full border-2 border-brand-midblue animate-fade-in max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                
                <div className="px-6 py-4 bg-brand-darkblue border-b border-brand-midblue">
                    <h3 className="text-lg font-bold text-brand-cream uppercase">Check-in: {reservation.unit_id}</h3>
                    <p className="text-brand-cream/80 text-sm mt-1">
                        {reservation.guest?.full_name || 'Huésped'} • {reservation.check_in} al {reservation.check_out}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    
                    <div className="bg-white p-4 rounded-lg border border-brand-midblue">
                        <h4 className="font-bold text-brand-midblue mb-3 uppercase text-sm">Datos del Titular</h4>
                        
                        <div className="mb-3">
                            <label className="block text-xs font-bold text-brand-darkblue uppercase mb-1">Nombre completo *</label>
                            <input type="text" value={form.fullName} onChange={(e) => updateForm('fullName', e.target.value)} className="input-high-contrast" required />
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <label className="block text-xs font-bold text-brand-darkblue uppercase mb-1">Ciudad</label>
                                <input type="text" value={form.city} onChange={(e) => updateForm('city', e.target.value)} className="input-high-contrast" placeholder="Ej: San Carlos" />
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
                        <h4 className="font-bold text-brand-midblue mb-3 uppercase text-sm">Estadía</h4>
                        
                        <div className="grid grid-cols-2 gap-3 mb-3">
                            <div>
                                <label className="block text-xs font-bold text-brand-darkblue uppercase mb-1">Orden de Estada N°</label>
                                <input type="number" value={form.ordenEstada} onChange={(e) => updateForm('ordenEstada', e.target.value)} className="input-high-contrast" placeholder="Opcional" />
                            </div>
                            <div className="flex items-end pb-2">
                                <span className="text-sm text-gray-600 font-bold">
                                    {calculateDays(reservation.check_in, reservation.check_out)} noches
                                </span>
                            </div>
                        </div>

                        <label className="block text-xs font-bold text-brand-darkblue uppercase mb-2">Pasajeros</label>
                        <div className="grid grid-cols-4 gap-2">
                            <div>
                                <label className="block text-[10px] text-gray-500 uppercase text-center">Total</label>
                                <input type="number" min="1" value={form.paxTotal} onChange={(e) => updateForm('paxTotal', e.target.value)} className="input-high-contrast text-center" />
                            </div>
                            <div>
                                <label className="block text-[10px] text-gray-500 uppercase text-center">Afi</label>
                                <input type="number" min="0" value={form.paxAfiliados} onChange={(e) => updateForm('paxAfiliados', e.target.value)} className="input-high-contrast text-center" />
                            </div>
                            <div>
                                <label className="block text-[10px] text-gray-500 uppercase text-center">Conv</label>
                                <input type="number" min="0" value={form.paxConvenio} onChange={(e) => updateForm('paxConvenio', e.target.value)} className="input-high-contrast text-center" />
                            </div>
                            <div>
                                <label className="block text-[10px] text-gray-500 uppercase text-center">Pas</label>
                                <input type="number" min="0" value={form.paxPasantes} onChange={(e) => updateForm('paxPasantes', e.target.value)} className="input-high-contrast text-center" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-brand-darkblue uppercase mb-1">Observaciones</label>
                        <textarea value={form.notes} onChange={(e) => updateForm('notes', e.target.value)} className="input-high-contrast" rows="2" />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 py-3 bg-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-400">
                            Cancelar
                        </button>
                        <button type="submit" disabled={loading} className="flex-1 py-3 bg-brand-red text-white font-bold rounded-lg hover:bg-red-600 shadow-lg disabled:bg-gray-400">
                            {loading ? 'Guardando...' : '✅ CONFIRMAR CHECK-IN'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
