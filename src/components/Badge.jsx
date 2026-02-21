export const Badge = ({ children, variant = 'default' }) => {
    const variants = {
        default: 'bg-gray-200 text-gray-700',
        success: 'bg-green-500 text-white',
        warning: 'bg-yellow-500 text-white',
        danger: 'bg-red-500 text-white',
        info: 'bg-blue-500 text-white'
    }
    return (
        <span className={`px-2 py-1 rounded text-xs font-bold ${variants[variant]}`}>
            {children}
        </span>
    )
}
