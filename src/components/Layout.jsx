import { Button } from './Button'

export const Layout = ({ user, activeModule, onNavigate, onLogout, children }) => {
    const navItems = [
        { id: 'home', label: 'INICIO', icon: '🏠' },
        { id: 'planning', label: 'PLAN', icon: '📅' },
        { id: 'reservations', label: 'RESERVAS', icon: '📝' },
        { id: 'checkin', label: 'CHECK-IN', icon: '✅' },
        { id: 'invoices', label: 'FACT', icon: '💵' },
        { id: 'cash', label: 'CAJA', icon: '💰' },
        { id: 'pax', label: 'PAX', icon: '👥' },
        { id: 'reports', label: 'REPORTES', icon: '📊' },
        { id: 'stats', label: 'STATS', icon: '📈' },
    ]

    return (
        <div className="min-h-screen bg-brand-darkblue flex flex-col">
            <nav className="bg-brand-darkblue border-b border-brand-midblue px-4 py-3 sticky top-0 z-50">
                <div className="max-w-[1600px] mx-auto flex flex-wrap justify-between items-center gap-2">
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                        <div className="flex items-center gap-2 mr-4">
                            <div className="w-8 h-8 bg-brand-midblue rounded-full flex items-center justify-center text-white font-bold text-xs">
                                ISSN
                            </div>
                            <div className="hidden sm:block">
                                <h1 className="text-sm font-black text-brand-cream leading-tight">LAS GRUTAS</h1>
                                <p className="text-[10px] text-brand-midblue uppercase tracking-wider">Recepción</p>
                            </div>
                        </div>
                        
                        {navItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => onNavigate(item.id)}
                                className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                                    activeModule === item.id 
                                        ? 'bg-brand-red text-white shadow-lg' 
                                        : 'text-brand-midblue hover:text-white hover:bg-white/10'
                                }`}
                            >
                                <span>{item.icon}</span>
                                <span className="hidden md:inline">{item.label}</span>
                            </button>
                        ))}
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <span className="text-brand-cream text-xs hidden lg:block">{user?.email}</span>
                        <button onClick={onLogout} className="p-2 text-brand-cream hover:text-white hover:bg-white/10 rounded-lg">
                            🚪
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-[1600px] mx-auto px-4 py-6 flex-1 w-full">
                {children}
            </main>

            <footer className="border-t border-brand-midblue/30 px-4 py-4">
                <div className="max-w-[1600px] mx-auto text-center text-brand-midblue text-xs">
                    Sistema de Recepción Las Grutas | ISSN 2026 | v3.1
                </div>
            </footer>
        </div>
    )
}
