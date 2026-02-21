export const Button = ({ children, onClick, variant = 'primary', disabled, loading, className = '', type = 'button' }) => {
    const baseClass = "px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2 justify-center "
    const variants = {
        primary: "bg-brand-red text-white hover:bg-red-600 shadow-lg disabled:bg-gray-400",
        secondary: "bg-brand-midblue text-white hover:bg-green-600",
        ghost: "bg-white/10 text-white hover:bg-white/20",
        outline: "border-2 border-brand-midblue text-brand-midblue hover:bg-brand-midblue hover:text-white",
        success: "bg-green-500 text-white hover:bg-green-600",
        warning: "bg-brand-orange text-white hover:bg-orange-600"
    }
    return (
        <button 
            type={type}
            onClick={onClick} 
            disabled={disabled || loading}
            className={baseClass + variants[variant] + ' ' + className}
        >
            {loading && <span className="animate-spin">⟳</span>}
            {children}
        </button>
    )
}
