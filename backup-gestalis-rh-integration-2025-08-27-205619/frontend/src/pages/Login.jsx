import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { GestalisCard, GestalisCardHeader, GestalisCardTitle, GestalisCardDescription, GestalisCardContent } from '@/components/ui/gestalis-card';
import { Input } from '@/components/ui/input';
import { GestalisButton } from '@/components/ui/gestalis-button';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuthStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        
        try {
            console.log('Tentative de connexion avec:', { email, password: '***' });
            await login(email, password);
            console.log('Connexion réussie via store');
            navigate('/');
            console.log('Navigation effectuée');
        } catch (err) {
            console.error('Erreur de connexion:', err);
            console.error('Détails de l\'erreur:', err.response?.data);
            setError(err.response?.data?.detail || err.message || "Échec de connexion");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gestalis-primary via-gestalis-primary-light to-gestalis-secondary">
            <GestalisCard className="w-96 animate-scale-in">
                <GestalisCardHeader>
                    <GestalisCardTitle className="text-gestalis-primary">Connexion GESTALIS</GestalisCardTitle>
                    <GestalisCardDescription>
                        Entrez vos identifiants pour accéder à votre espace
                    </GestalisCardDescription>
                </GestalisCardHeader>
                <GestalisCardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Votre email"
                                required
                                className="mt-1 focus:ring-gestalis-primary focus:border-gestalis-primary"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Mot de passe
                            </label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Votre mot de passe"
                                required
                                className="mt-1 focus:ring-gestalis-primary focus:border-gestalis-primary"
                            />
                        </div>
                        <GestalisButton
                            type="submit"
                            variant="primary"
                            size="lg"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Connexion...' : 'Se connecter'}
                        </GestalisButton>
                    </form>
                </GestalisCardContent>
            </GestalisCard>
        </div>
    );
}

export default Login;