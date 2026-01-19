import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { LockIcon, EnvelopeSimpleIcon, WarningCircleIcon, UserIcon, ArrowRightIcon } from '@phosphor-icons/react';
import { registerSchema, type RegisterSchema } from '../schemas/auth';
import { api } from '../lib/api';
import { Input } from '../components/forms/Input';
import { AxiosError } from 'axios';

export function SignUp() {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterSchema>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterSchema) => {
        setErrorMessage('');
        setIsSubmitting(true);

        const { confirmPassword, ...submitData } = data;

        try {
            const payload = { ...submitData, userName: submitData.username };
            await api.post('/auth/signup', payload);
            navigate('/signin?registered=true');
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                if (error.response.status === 409) {
                    setErrorMessage('Este e-mail ou usuário já está em uso.');
                } else {
                    setErrorMessage(error.response.data?.message || 'Erro ao criar conta.');
                }
            } else {
                setErrorMessage('Ocorreu um erro inesperado.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-hunt-dark-500 flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8">
            <div className="bg-hunt-dark-400/20 border-hunt-purple-300/10 mx-auto w-full max-w-xs rounded-xl border p-8 sm:max-w-lg">
                <div className="text-center sm:mx-auto sm:w-full sm:max-w-sm">
                    <div className="bg-hunt-purple-500 shadow-hunt-purple-500/20 mx-auto mb-6 flex h-12 w-12 rotate-45 items-center justify-center rounded-lg shadow-lg">
                        <div className="-rotate-45 text-xl font-bold text-white">+</div>
                    </div>

                    <h2 className="text-hunt-light-600 text-center text-2xl leading-9 font-bold tracking-tight">
                        Crie sua conta
                    </h2>
                    <p className="text-hunt-light-300 mt-2 text-center text-sm">
                        Já tem uma conta?{' '}
                        <Link
                            to="/signin"
                            className="text-hunt-purple-400 hover:text-hunt-purple-300 font-semibold transition-colors"
                        >
                            Faça login
                        </Link>
                    </p>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
                    <form className="space-y-8" onSubmit={handleSubmit(onSubmit)} noValidate>
                        <Input
                            label="Nome de usuário"
                            placeholder="Ex: BonusHunt"
                            autoComplete="username"
                            error={errors.username}
                            icon={<UserIcon className="text-hunt-light-400 h-4 w-4" />}
                            {...register('username')}
                        />

                        <Input
                            label="Endereço de e-mail"
                            type="email"
                            placeholder="email@exemplo.com"
                            autoComplete="email"
                            error={errors.email}
                            icon={<EnvelopeSimpleIcon className="text-hunt-light-400 h-4 w-4" />}
                            {...register('email')}
                        />

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <Input
                                label="Senha"
                                type="password"
                                placeholder="••••••"
                                autoComplete="new-password"
                                error={errors.password}
                                icon={<LockIcon className="text-hunt-light-400 h-4 w-4" />}
                                {...register('password')}
                            />

                            <Input
                                label="Confirmar"
                                type="password"
                                placeholder="••••••"
                                autoComplete="new-password"
                                error={errors.confirmPassword}
                                icon={<LockIcon className="text-hunt-light-400 h-4 w-4" />}
                                {...register('confirmPassword')}
                            />
                        </div>

                        {errorMessage && (
                            <div className="animate-fade-in bg-hunt-red-500/10 border-hunt-red-500/20 text-hunt-red-200 flex items-center gap-3 rounded-md border p-3 text-sm">
                                <WarningCircleIcon className="h-5 w-5 shrink-0" />
                                <p className="font-medium">{errorMessage}</p>
                            </div>
                        )}

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-hunt-purple-500 hover:bg-hunt-purple-300 text-hunt-light-300 hover:text-hunt-light-500 shadow-hunt-purple-500/20 flex w-full items-center justify-center gap-2 rounded-md px-6 py-2.5 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSubmitting ? 'Criando conta...' : 'Criar Conta'}
                                {!isSubmitting && <ArrowRightIcon className="h-4 w-4" />}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
