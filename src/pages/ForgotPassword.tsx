import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { EnvelopeSimpleIcon, WarningCircleIcon, CheckCircleIcon, ArrowLeftIcon } from '@phosphor-icons/react';
import { forgotPasswordSchema } from '../schemas/auth';
import { api } from '../lib/api';
import { Input } from '../components/forms/Input';
import { z } from 'zod';

type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export function ForgotPassword() {
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<ForgotPasswordSchema>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const emailValue = watch('email');

    const onSubmit = async (data: ForgotPasswordSchema) => {
        setErrorMessage('');
        setIsLoading(true);

        try {
            await api.post('/auth/forgot-password', data);
            setSuccessMessage(true);
        } catch (error: any) {
            setErrorMessage(error.response?.data?.message || 'Falha na conexão.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-hunt-dark-500 flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8">
            <div className="bg-hunt-dark-400/20 border-hunt-purple-300/10 mx-auto w-full max-w-xs rounded-xl border p-8 sm:max-w-lg">
                <div className="text-center sm:mx-auto sm:w-full sm:max-w-sm">
                    <div className="bg-hunt-purple-400 mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-lg shadow-lg">
                        <EnvelopeSimpleIcon className="text-hunt-light-600 h-6 w-6" weight="fill" />
                    </div>

                    <h2 className="text-hunt-light-600 text-center text-2xl font-bold tracking-tight">
                        Recuperar Senha
                    </h2>

                    {!successMessage && (
                        <p className="text-hunt-light-300 mt-2 text-center text-sm">
                            Informe seu e-mail para receber as instruções de redefinição.
                        </p>
                    )}
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
                    {successMessage ? (
                        <div className="animate-fade-in text-center">
                            <div className="bg-hunt-purple-500/10 border-hunt-purple-500/20 mb-6 rounded-lg border p-4">
                                <div className="flex flex-col items-center gap-3">
                                    <CheckCircleIcon className="text-hunt-purple-400 h-10 w-10" weight="fill" />
                                    <h3 className="text-hunt-light-600 font-semibold">E-mail enviado!</h3>
                                    <p className="text-hunt-light-400 text-sm">
                                        Se uma conta existir para <strong className="text-hunt-purple-300">{emailValue}</strong>, você receberá um link para redefinir sua senha em instantes.
                                    </p>
                                </div>
                            </div>

                            <Link
                                to="/signin"
                                className="text-hunt-light-500 hover:text-hunt-purple-300 flex items-center justify-center gap-2 text-sm font-semibold transition-colors"
                            >
                                <ArrowLeftIcon className="h-4 w-4" weight="bold" />
                                Voltar para o login
                            </Link>
                        </div>
                    ) : (
                        <>
                            <form className="space-y-8" onSubmit={handleSubmit(onSubmit)} noValidate>
                                <Input
                                    label="E-mail cadastrado"
                                    type="email"
                                    placeholder="email@exemplo.com"
                                    error={errors.email}
                                    icon={<EnvelopeSimpleIcon className="text-hunt-light-600 h-4 w-4" />}
                                    {...register('email')}
                                />

                                {errorMessage && (
                                    <div className="animate-fade-in bg-hunt-red-300 border-hunt-red-200 text-hunt-light-600 flex items-center gap-3 rounded-md border p-3 text-sm">
                                        <WarningCircleIcon className="h-5 w-5 shrink-0" weight="fill" />
                                        <p className="font-medium">{errorMessage}</p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-hunt-purple-500 hover:bg-hunt-purple-300 text-hunt-light-300 hover:text-hunt-light-500 shadow-hunt-purple-500/20 flex w-full justify-center rounded-md px-6 py-2.5 text-sm font-bold transition-colors disabled:opacity-50"
                                >
                                    {isLoading ? 'Enviando...' : 'Enviar link de recuperação'}
                                </button>
                            </form>

                            <p className="text-hunt-light-600 mt-10 text-center text-sm">
                                Lembrou sua senha?{' '}
                                <Link
                                    to="/signin"
                                    className="text-hunt-purple-300 hover:text-hunt-purple-300 font-semibold transition-colors"
                                >
                                    Entrar
                                </Link>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
