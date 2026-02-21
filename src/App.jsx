import { useState, useEffect } from 'react'
import { supabaseClient } from './utils/supabase'
import { DashboardHome } from './modules/DashboardHome'
import { LoginScreen } from './modules/LoginScreen'
import { InvoiceModule } from './modules/InvoiceModule'
import { InvoicesListModule } from './modules/InvoicesListModule'
import { NewReservationModule } from './modules/NewReservationModule'
import { PlanningModule } from './modules/PlanningModule'
import { CheckInForm } from './modules/CheckInForm'
import { EditReservationModal } from './modules/EditReservationModal'
import { ReservationModal } from './modules/ReservationModal'
import { Button } from './components/Button'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(true)
  const [activeModule, setActiveModule] = useState('home')
  const [moduleParams, setModuleParams] = useState({})

  useEffect(() => {
    // Verificar sesión existente
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setUser(session.user)
      setChecking(false)
    })

    // Escuchar cambios de auth
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleNavigate = (module, params = {}) => {
    setActiveModule(module)
    setModuleParams(params)
  }

  const handleCreateInvoice = (reservation) => {
    handleNavigate('invoice', { reservation })
  }

  const handleLogout = async () => {
    await supabaseClient.auth.signOut()
    setUser(null)
    setActiveModule('home')
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-darkblue">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-midblue"></div>
      </div>
    )
  }

  if (!user) {
    return <LoginScreen onLogin={setUser} />
  }

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
    <div className="min-h-screen bg-brand-darkblue">
      {/* HEADER */}
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
                onClick={() => handleNavigate(item.id)}
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
            <span className="text-brand-cream text-xs hidden lg:block">{user.email}</span>
            <button 
              onClick={handleLogout} 
              className="p-2 text-brand-cream hover:text-white hover:bg-white/10 rounded-lg"
              title="Cerrar sesión"
            >
              🚪
            </button>
          </div>
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-[1600px] mx-auto px-4 py-6">
        {activeModule === 'home' && (
          <DashboardHome 
            onNavigate={handleNavigate} 
            onCreateInvoice={handleCreateInvoice}
          />
        )}
        
        {activeModule === 'planning' && (
          <PlanningModule onBack={() => handleNavigate('home')} />
        )}

        {activeModule === 'invoices' && (
          <InvoicesListModule onBack={() => handleNavigate('home')} />
        )}

        {activeModule === 'invoice' && (
          <InvoiceModule 
            reservation={moduleParams.reservation}
            onBack={() => handleNavigate('home')}
          />
        )}

        {activeModule === 'reservations' && (
          <NewReservationModule 
            onBack={() => handleNavigate('home')}
            preselectedUnit={moduleParams.unitId}
          />
        )}

        {activeModule === 'checkin' && (
          <CheckInForm 
            onBack={() => handleNavigate('home')}
            reservation={moduleParams.reservation}
          />
        )}

        {/* Placeholders para módulos pendientes */}
        {['cash', 'reports', 'stats', 'pax'].includes(activeModule) && (
          <div className="text-white text-center py-20">
            <h2 className="text-2xl font-bold mb-4">
              Módulo {navItems.find(n => n.id === activeModule)?.label}
            </h2>
            <p className="text-brand-cream/70 mb-6">En desarrollo...</p>
            <Button onClick={() => handleNavigate('home')} variant="secondary">
              Volver al Inicio
            </Button>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-brand-midblue/30 px-4 py-4 mt-auto">
        <div className="max-w-[1600px] mx-auto text-center text-brand-midblue text-xs">
          Sistema de Recepción Las Grutas | ISSN 2026 | v3.1
        </div>
      </footer>

      {/* Modales globales */}
      {moduleParams.editReservation && (
        <EditReservationModal
          reservation={moduleParams.editReservation}
          onClose={() => {
            setModuleParams(p => ({ ...p, editReservation: null }))
            handleNavigate('home')
          }}
        />
      )}

      {moduleParams.viewReservation && (
        <ReservationModal
          reservation={moduleParams.viewReservation}
          onClose={() => setModuleParams(p => ({ ...p, viewReservation: null }))}
        />
      )}
    </div>
  )
}

export default App
