import { getToday, calculateDays } from '../utils/helpers'

export const ReservationModal = ({ reservation, onClose, onCheckIn, onDelete, onEdit }) => {
    if (!reservation) return null

    const today = getToday()
    const isCheckInDay = reservation.check_in === today
    const isCheckedIn = reservation.status === 'checked_in'
    const nights = calculateDays(reservation.check_in, reservation.check_out)

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border-2 border-brand-midblue animate-fade-in" onClick={(e) => e.stopPropagation()}>
                
                <div className={`px-6 py-4 rounded-t-xl ${isCheckedIn ? 'bg-[#FF6B75]' : isCheckInDay ? 'bg-[#87B867]' : 'bg-yellow-400'}`}>
                    <h3 className="text-xl font-black text-white uppercase text-center">
                        {isCheckedIn ? 'Ocupación Actual' : isCheckInDay ? '¡Check-in Hoy!' : 'Reserva Futura'}
                    </h3>
                </div>

                <div className="p-6 space-y-4">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-brand-darkblue">{reservation.guest?.full_name || 'Sin nombre'}</p>
                        <p className="text-gray-500">{reservation.unit_id}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Ingreso:</span>
                            <span className="font-bold">{reservation.check_in}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Salida:</span>
                            <span className="font-bold">{reservation.check_out}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Noches:</span>
                            <span className="font-bold">{nights}</span>
                        </div>
                    </div>

                    {isCheckedIn && (
                        <div className="bg-brand-cream p-4 rounded-lg">
                            <p className="font-bold text-brand-darkblue mb-2">Pasajeros:</p>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>Total: <strong>{reservation.pax_total || 0}</strong></div>
                                <div>Afiliados: <strong>{reservation.pax_afiliados || 0}</strong></div>
                                <div>Convenio: <strong>{reservation.pax_convenio || 0}</strong></div>
                                <div>Pasantes: <strong>{reservation.pax_pasantes || 0}</strong></div>
                            </div>
                            {reservation.orden_estada && (
                                <p className="mt-2 text-sm">Orden: <strong>{reservation.orden_estada}</strong></p>
                            )}
                        </div>
                    )}

                    <div className="flex gap-2 pt-2 flex-wrap">
                        <button onClick={onClose} className="flex-1 py-3 bg-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-400">
                            Cerrar
                        </button>
                        
                        {!isCheckedIn && (
                            <button onClick={() => { onClose(); onCheckIn(reservation); }} className="flex-1 py-3 bg-[#87B867] text-white font-bold rounded-lg hover:bg-green-600 shadow-lg">
                                🛎️ CHECK-IN
                            </button>
                        )}

                        <button onClick={() => { onClose(); onEdit(reservation); }} className="px-4 py-3 bg-blue-100 text-blue-600 font-bold rounded-lg hover:bg-blue-200" title="Editar">
                            ✏️
                        </button>
                        
                        <button onClick={() => { if (confirm('¿Eliminar esta reserva?')) { onDelete(reservation.id); onClose(); } }} className="px-4 py-3 bg-red-100 text-red-600 font-bold rounded-lg hover:bg-red-200" title="Eliminar">
                            🗑️
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
