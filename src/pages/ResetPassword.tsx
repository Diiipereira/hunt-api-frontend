import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { KeyReturnIcon, WarningCircleIcon, CheckCircleIcon, ArrowRightIcon, LockIcon } from '@phosphor-icons/react';
import { resetPasswordSchema } from '../schemas/auth';
import { api } from '../lib/api';
import { Input } from '../components/forms/Input';
import { z } from 'zod';

type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

export function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isTokenValid, setIsTokenValid] = useState(false);

    const tokenFromUrl = searchParams.get('token');

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<ResetPasswordSchema>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { token: tokenFromUrl || '' }
    });

    useEffect(() => {
        if (tokenFromUrl) {
            setValue('token', tokenFromUrl);
            setIsTokenValid(true);
        } else {
            setErrorMessage('Link inválido ou incompleto.');
        }
    }, [tokenFromUrl, setValue]);

    const onSubmit = async (data: ResetPasswordSchema) => {
        setIsLoading(true);
        setErrorMessage('');

        try {
            await api.post('/auth/reset-password', { token: data.token, password: data.password });
            setSuccessMessage(true);
            setTimeout(() => navigate('/signin'), 5000);
        } catch (error: any) {
            const status = error.response?.status;
            if (status === 404 || status === 400) {
                setErrorMessage('Este link é inválido ou já expirou. Solicite um novo link de redefinição de senha.');
            } else if (status === 429) {
                setErrorMessage('Muitas tentativas. Tente novamente em alguns minutos.');
            } else {
                setErrorMessage('Ocorreu um erro inesperado. Tente novamente.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-hunt-dark-500 flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8">
            <div className="bg-hunt-dark-400/20 border-hunt-purple-300/10 mx-auto w-full max-w-xs rounded-xl border p-8 sm:max-w-lg">
                <div className="text-center sm:mx-auto sm:w-full sm:max-w-sm">
                    <div className="bg-hunt-purple-400 shadow-hunt-purple-500/20 mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-lg shadow-lg">
                        <KeyReturnIcon className="text-hunt-light-600 h-6 w-6" weight="fill" />
                    </div>

                    <h2 className="text-hunt-light-600 text-center text-2xl font-bold tracking-tight">Nova Senha</h2>

                    {!successMessage && (
                        <p className="text-hunt-light-300 mt-2 text-center text-sm">
                            Crie uma nova senha segura para sua conta.
                        </p>
                    )}
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
                    {successMessage ? (
                        <div className="animate-fade-in text-center">
                            <div className="bg-hunt-purple-500/10 border-hunt-purple-500/20 mb-6 rounded-lg border p-4">
                                <div className="flex flex-col items-center gap-3">
                                    <CheckCircleIcon className="text-hunt-purple-400 h-10 w-10" weight="fill" />
                                    <h3 className="text-hunt-light-600 font-semibold">Senha Alterada!</h3>
                                    <p className="text-hunt-light-400 text-sm">
                                        Sua senha foi redefinida com sucesso. Você será redirecionado para o login.
                                    </p>
                                </div>
                            </div>

                            <Link
                                to="/signin"
                                className="bg-hunt-purple-500 hover:bg-hunt-purple-300 text-hunt-light-300 flex w-full items-center justify-center gap-2 rounded-md py-2.5 text-sm font-bold transition-colors"
                            >
                                Ir para Login
                                <ArrowRightIcon className="h-4 w-4" weight="bold" />
                            </Link>
                        </div>
                    ) : (
                        <form className="space-y-8" onSubmit={handleSubmit(onSubmit)} noValidate>
                            <Input
                                label="Nova senha"
                                type="password"
                                placeholder="••••••••"
                                error={errors.password}
                                icon={<LockIcon className="text-hunt-light-600 h-4 w-4" />}
                                {...register('password')}
                            />

                            <Input
                                label="Confirmar senha"
                                type="password"
                                placeholder="••••••••"
                                error={errors.confirmPassword}
                                icon={<LockIcon className="text-hunt-light-600 h-4 w-4" />}
                                {...register('confirmPassword')}
                            />

                            {errorMessage && (
                                <div className="animate-fade-in flex flex-col gap-4">
                                    <div className="bg-hunt-red-300 border-hunt-red-200 text-hunt-light-300 flex items-center gap-3 rounded-md border p-3 text-sm">
                                        <WarningCircleIcon className="h-5 w-5 shrink-0" weight="fill" />
                                        <p className="font-medium">{errorMessage}</p>
                                    </div>

                                    <Link
                                        to="/forgot-password"
                                        className="bg-hunt-dark-400 hover:bg-hunt-dark-300 text-hunt-light-300 flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium transition-colors"
                                    >
                                        Solicitar novo link
                                    </Link>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading || !isTokenValid}
                                className="bg-hunt-purple-500 hover:bg-hunt-purple-300 text-hunt-light-300 hover:text-hunt-light-500 shadow-hunt-purple-500/20 flex w-full justify-center rounded-md px-6 py-2.5 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isLoading ? 'Redefinindo...' : 'Redefinir Senha'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
