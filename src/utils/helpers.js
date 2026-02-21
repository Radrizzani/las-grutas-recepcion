export const formatDateISO = (date) => {
    if (typeof date === 'string') return date
    return date.toISOString().split('T')[0]
}

export const getToday = () => formatDateISO(new Date())

export const addDays = (dateStr, days) => {
    const d = new Date(dateStr)
    d.setDate(d.getDate() + days)
    return formatDateISO(d)
}

export const isToday = (dateStr) => dateStr === getToday()

export const isPast = (dateStr) => dateStr < getToday()

export const formatDisplay = (dateStr) => new Date(dateStr).getDate()

export const getDayName = (dateStr) => {
    const days = ['D', 'L', 'M', 'M', 'J', 'V', 'S']
    return days[new Date(dateStr).getDay()]
}

export const calculateDays = (start, end) => {
    const s = new Date(start)
    const e = new Date(end)
    return Math.ceil((e - s) / (1000 * 60 * 60 * 24))
}

export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0
    }).format(amount || 0)
}

export const getStatusColor = (reservation, today) => {
    if (!reservation) return 'status-free'
    if (reservation.status === 'checked_in') return 'status-occupied'
    if (reservation.check_in === today) return 'status-checkin'
    if (reservation.check_out === today) return 'status-checkout'
    return 'status-reserved'
}

export const getStatusText = (reservation, today) => {
    if (!reservation) return 'Libre'
    if (reservation.status === 'checked_in') return 'Ocupado'
    if (reservation.check_in === today) return 'Check-in Hoy'
    if (reservation.check_out === today) return 'Check-out Hoy'
    return 'Reservado'
}
