import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogIn, Loader2 } from 'lucide-react';

const loginSchema = z.object({
    email: z.string().email('Format d\'email invalide'),
    password: z.string().min(4, 'Le mot de passe doit contenir au moins 4 caractères'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const Login = () => {
    const { login, loading, error, isAuthenticated, user, clearError } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    useEffect(() => {
        if (isAuthenticated && user) {
            const defaultRoute =
                user.role === 'ADMIN' || user.role === 'MANAGER' ? '/admin' :
                    user.role === 'LIVREUR' ? '/livreur' : '/client';

            navigate(from === '/' ? defaultRoute : from, { replace: true });
        }
    }, [isAuthenticated, user, navigate, from]);

    useEffect(() => {
        return () => {
            clearError();
        };
    }, [clearError]);

    const onSubmit = async (data: LoginFormValues) => {
        try {
            await login(data);
        } catch (err) {
            // Error is handled in the thunk
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                <div>
                    <div className="flex justify-center">
                        <LogIn className="h-12 w-12 text-blue-600" />
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        VertDrop Login
                    </h2>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    {error && <div className="text-red-600 text-center text-sm bg-red-50 p-2 rounded">{error}</div>}

                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <input
                                {...register('email')}
                                type="email"
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Email"
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                        </div>
                        <div>
                            <input
                                {...register('password')}
                                type="password"
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {loading && <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />}
                            {loading ? 'Logging in...' : 'Sign in'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
