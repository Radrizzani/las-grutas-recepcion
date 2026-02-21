// ============================================
// UTILIDADES DE FECHA
// ============================================

export const formatDateISO = (date) => {
    if (typeof date === 'string') return date
    return date.toISOString().split('T')[0]
}

export const getToday = () => formatDateISO(new Date())

export const addDays = (dateStr, days) => {
    const d = new Date(dateStr + 'T00:00:00') // Evita problemas de zona horaria
    d.setDate(d.getDate() + days)
    return formatDateISO(d)
}

export const isToday = (dateStr) => dateStr === getToday()

export const isPast = (dateStr) => dateStr < getToday()

// Corregido: evita problemas de zona horaria
export const formatDisplay = (dateStr) => {
    const [year, month, day] = dateStr.split('-').map(Number)
    return day
}

export const getDayName = (dateStr) => {
    const days = ['D', 'L', 'M', 'M', 'J', 'V', 'S']
    const d = new Date(dateStr + 'T00:00:00') // Evita problemas de zona horaria
    return days[d.getDay()]
}

export const calculateDays = (start, end) => {
    const s = new Date(start + 'T00:00:00')
    const e = new Date(end + 'T00:00:00')
    return Math.ceil((e - s) / (1000 * 60 * 60 * 24))
}

// ============================================
// UTILIDADES DE FORMATO
// ============================================

export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0
    }).format(amount || 0)
}

// ============================================
// UTILIDADES DE ESTADO
// ============================================

// Corregido: nombres de clases CSS actualizados
export const getStatusColor = (reservation, today) => {
    if (!reservation) return 'status-free'
    if (reservation.status === 'checked_in') return 'status-occupied'
    if (reservation.check_in === today) return 'status-checkin-today'  // ← CORREGIDO
    if (reservation.check_out === today) return 'status-checkout-today' // ← CORREGIDO
    return 'status-reserved'
}

export const getStatusText = (reservation, today) => {
    if (!reservation) return 'Libre'
    if (reservation.status === 'checked_in') return 'Ocupado'
    if (reservation.check_in === today) return 'Check-in Hoy'
    if (reservation.check_out === today) return 'Check-out Hoy'
    return 'Reservado'
}
