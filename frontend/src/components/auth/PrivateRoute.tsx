import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { AuthForm } from './AuthForm';

interface PrivateRouteProps {
    children: ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
    const { isAuthenticated, checkAuth } = useAuthStore();
    const [showAuthForm, setShowAuthForm] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        checkAuth();
        setIsInitialized(true);
    }, [checkAuth]);

    useEffect(() => {
        if (isInitialized && !isAuthenticated) {
            setShowAuthForm(true);
        } else if (isAuthenticated) {
            setShowAuthForm(false);
        }
    }, [isAuthenticated, isInitialized]);

    if (!isInitialized) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="max-w-md w-full space-y-8 p-6">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Markdown Editor</h1>
                        <p className="text-gray-600 mb-8">Please log in to access your notes</p>
                        <button
                            onClick={() => setShowAuthForm(true)}
                            className="bg-gray-700 text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
                        >
                            Login / Sign Up
                        </button>
                    </div>
                </div>

                {showAuthForm && (
                    <AuthForm onClose={() => setShowAuthForm(false)} />
                )}
            </div>
        );
    }

    return <>{children}</>;
}