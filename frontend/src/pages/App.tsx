import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useAuthStore } from '../stores/authStore';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { MarkdownEditor } from '../components/editor/MarkdownEditor';
import { AuthForm } from '../components/auth/AuthForm';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

function AppContent() {
    const { checkAuth, isAuthenticated, isLoading } = useAuthStore();
    const [showAuthForm, setShowAuthForm] = useState(false);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700"></div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col">
            <Header onAuthClick={() => setShowAuthForm(true)} />
            
            {isAuthenticated ? (
                <div className="flex-1 flex overflow-hidden">
                    <Sidebar />
                    <MarkdownEditor />
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">Welcome to Markdown Editor</h1>
                        <p className="text-gray-600 mb-6">Sign in to start working with your notes</p>
                        <button
                            onClick={() => setShowAuthForm(true)}
                            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
                        >
                            Login or Register
                        </button>
                    </div>
                </div>
            )}
            
            {showAuthForm && (
                <AuthForm onClose={()=> setShowAuthForm(false)}/>
            )}
        </div>
    );
}

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AppContent />
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}