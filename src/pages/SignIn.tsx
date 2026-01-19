import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { LockIcon, EnvelopeSimpleIcon, WarningCircleIcon } from '@phosphor-icons/react';
import { loginSchema, type LoginSchema } from '../schemas/auth';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/auth';
import { Input } from '../components/forms/Input';

export function SignIn() {
    const navigate = useNavigate();
    const { login } = useAuthStore();
    const [loginError, setLoginError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [lockedUntil, setLockedUntil] = useState<number | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginSchema) => {
        if (lockedUntil && Date.now() < lockedUntil) {
            const secondsLeft = Math.ceil((lockedUntil - Date.now()) / 1000);
            setLoginError(`Muitas tentativas. Aguarde ${secondsLeft} segundos.`);
            return;
        }

        setLoginError('');
        setIsLoading(true);

        try {
            const res = await api.post('/auth/signin', data);

            if (res.status !== 200 && res.status !== 201) {
                handleError();
                return;
            }

            setAttempts(0);
            login();
            navigate('/dashboard');
        } catch {
            handleError();
        } finally {
            setIsLoading(false);
        }
    };

    const handleError = () => {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        if (newAttempts >= 5) {
            setLockedUntil(Date.now() + 30000);
            setAttempts(0);
            setLoginError('Muitas tentativas. Aguarde 30 segundos.');
        } else {
            setLoginError('E-mail ou senha incorretos.');
        }
    };

    return (
        <div className="bg-hunt-dark-500 flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8">
            <div className="bg-hunt-dark-400/20 border-hunt-purple-300/10 mx-auto w-full max-w-xs rounded-xl border p-8 sm:max-w-lg">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <div className="bg-hunt-purple-500 mx-auto mb-6 h-10 w-10 rotate-45 rounded-sm"></div>
                    <h2 className="text-hunt-light-600 text-center text-2xl font-bold tracking-tight">
                        Faça login na sua conta
                    </h2>
                    <p className="text-hunt-light-300 mt-2 text-center text-sm">
                        Ou{' '}
                        <Link
                            to="/signup"
                            className="text-hunt-purple-400 hover:text-hunt-purple-300 font-semibold transition-colors"
                        >
                            Comece a sua primeira caçada agora
                        </Link>
                    </p>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
                    <form className="space-y-8" onSubmit={handleSubmit(onSubmit)} noValidate>
                        <Input
                            label="Endereço de e-mail"
                            type="email"
                            placeholder="email@exemplo.com"
                            error={errors.email}
                            icon={<EnvelopeSimpleIcon className="text-hunt-light-600 h-4 w-4" />}
                            {...register('email')}
                        />

                        <Input
                            label="Senha"
                            type="password"
                            placeholder="••••••"
                            error={errors.password}
                            icon={<LockIcon className="text-hunt-light-600 h-4 w-4" />}
                            {...register('password')}
                        />

                        {loginError && (
                            <div className="animate-fade-in bg-hunt-red-300 border-hunt-red-200 text-hunt-light-600 flex items-center gap-3 rounded-md border p-3 text-sm">
                                <WarningCircleIcon className="h-5 w-5 shrink-0" weight="fill" />
                                <p className="font-medium">{loginError}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-hunt-purple-500 hover:bg-hunt-purple-300 text-hunt-light-300 hover:text-hunt-light-500 shadow-hunt-purple-500/20 flex w-full justify-center rounded-md px-6 py-2.5 text-sm font-bold transition-colors disabled:opacity-70"
                        >
                            {isLoading ? 'Entrando...' : 'Entrar'}
                        </button>
                    </form>

                    <p className="text-hunt-light-600 mt-10 text-center text-sm">
                        <Link
                            to="/forgot-password"
                            className="text-hunt-light-700 hover:text-hunt-light-300 font-semibold transition-colors"
                        >
                            Esqueceu sua senha?
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
