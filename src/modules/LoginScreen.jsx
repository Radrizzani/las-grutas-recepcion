import { useState } from 'react'
import { supabaseClient } from '../utils/supabase'
import { Button } from '../components/Button'
import { Card } from '../components/Card'

export const LoginScreen = ({ onLogin }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email.trim(),
            password
        })

        setLoading(false)

        if (error) {
            setError('Email o contraseña incorrectos')
            return
        }

        if (data?.user) onLogin(data.user)
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-brand-darkblue">
            <Card className="w-full max-w-md !p-8">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-brand-midblue rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-2xl">
                        ISSN
                    </div>
                    <h1 className="text-2xl font-black text-brand-darkblue">LAS GRUTAS</h1>
                    <p className="text-brand-midblue uppercase tracking-wider text-sm">Sistema de Recepción</p>
                </div>

                {error && (
                    <div className="bg-red-100 border-2 border-red-500 text-red-700 p-3 rounded-lg mb-4 font-bold text-sm text-center">
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-brand-darkblue uppercase mb-1">Email</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-high-contrast" 
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-brand-darkblue uppercase mb-1">Contraseña</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-high-contrast" 
                            required
                        />
                    </div>
                    <Button type="submit" loading={loading} className="w-full">
                        INGRESAR AL SISTEMA
                    </Button>
                </form>
            </Card>
        </div>
    )
}
