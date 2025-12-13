<script lang="ts">
	import { goto } from '$app/navigation';
	import { api } from '$lib/services/api';
	import { superForm, defaults } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { registerSchema } from '$lib/schemas/auth';
	import Input from '$lib/components/forms/Input.svelte';
	import { User, Mail, Lock, CircleAlert, ArrowRight } from 'lucide-svelte';

	const { form, errors, constraints, enhance } = superForm(
		defaults({ username: '', email: '', password: '', confirmPassword: '' }, zod(registerSchema)),
		{
			SPA: true,
			validators: zod(registerSchema),
			onUpdate: async ({ form: f }) => {
				if (f.valid) {
					await handleSignup(f.data);
				}
			}
		}
	);

	let errorMessage = $state('');
	let isSubmitting = $state(false);

	async function handleSignup(data: typeof $form) {
		errorMessage = '';
		isSubmitting = true;

		const { confirmPassword, ...submitData } = data;

		try {
			const payload = { ...submitData, userName: submitData.username };
			const response = await api('/auth/signup', {
				method: 'POST',
				body: JSON.stringify(payload)
			});

			const resData = await response.json();

			if (!response.ok) {
				if (response.status === 409) {
					throw new Error('Este e-mail ou usuário já está em uso.');
				}
				throw new Error(resData.message || 'Erro ao criar conta.');
			}

			goto('/signin?registered=true');
		} catch (error: any) {
			console.error('Erro no cadastro:', error);
			errorMessage = error.message || 'Ocorreu um erro inesperado.';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="bg-hunt-dark-500 flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8">
	<div
		class="bg-hunt-dark-400/20 border-hunt-purple-300/10 mx-auto w-full max-w-xs rounded-xl border p-8 sm:max-w-lg"
	>
		<div class="text-center sm:mx-auto sm:w-full sm:max-w-sm">
			<div
				class="bg-hunt-purple-500 shadow-hunt-purple-500/20 mx-auto mb-6 flex h-12 w-12 rotate-45 items-center justify-center rounded-lg shadow-lg"
			>
				<div class="-rotate-45 text-xl font-bold text-white">+</div>
			</div>

			<h2 class="text-hunt-light-600 text-center text-2xl leading-9 font-bold tracking-tight">
				Crie sua conta
			</h2>
			<p class="text-hunt-light-300 mt-2 text-center text-sm">
				Já tem uma conta?
				<a
					href="/signin"
					class="text-hunt-purple-400 hover:text-hunt-purple-300 font-semibold transition-colors"
				>
					Faça login
				</a>
			</p>
		</div>

		<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
			<form class="space-y-8" use:enhance method="POST" novalidate>
				<Input
					label="Nome de usuário"
					name="username"
					placeholder="Ex: BonusHunt"
					autocomplete="username"
					bind:value={$form.username}
					error={$errors.username}
					{...$constraints.username}
				>
					{#snippet icon()}
						<User class="text-hunt-light-400 h-4 w-4" />
					{/snippet}
				</Input>

				<Input
					label="Endereço de e-mail"
					name="email"
					type="email"
					placeholder="email@exemplo.com"
					autocomplete="email"
					bind:value={$form.email}
					error={$errors.email}
					{...$constraints.email}
				>
					{#snippet icon()}
						<Mail class="text-hunt-light-400 h-4 w-4" />
					{/snippet}
				</Input>

				<div class="grid grid-cols-1 gap-5 md:grid-cols-2">
					<Input
						label="Senha"
						name="password"
						type="password"
						placeholder="••••••"
						autocomplete="new-password"
						bind:value={$form.password}
						error={$errors.password}
						{...$constraints.password}
					>
						{#snippet icon()}
							<Lock class="text-hunt-light-400 h-4 w-4" />
						{/snippet}
					</Input>

					<Input
						label="Confirmar"
						name="confirmPassword"
						type="password"
						placeholder="••••••"
						autocomplete="new-password"
						bind:value={$form.confirmPassword}
						error={$errors.confirmPassword}
						{...$constraints.confirmPassword}
					>
						{#snippet icon()}
							<Lock class="text-hunt-light-400 h-4 w-4" />
						{/snippet}
					</Input>
				</div>

				{#if errorMessage}
					<div
						class="animate-fade-in bg-hunt-red-500/10 border-hunt-red-500/20 text-hunt-red-200 flex items-center gap-3 rounded-md border p-3 text-sm"
					>
						<CircleAlert class="h-5 w-5 shrink-0" />
						<p class="font-medium">{errorMessage}</p>
					</div>
				{/if}

				<div class="pt-2">
					<button
						type="submit"
						disabled={isSubmitting}
						class="bg-hunt-purple-500 hover:bg-hunt-purple-300 text-hunt-light-300 hover:text-hunt-light-500 shadow-hunt-purple-500/20 flex w-full items-center justify-center gap-2 rounded-md px-6 py-2.5 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
					>
						{isSubmitting ? 'Criando conta...' : 'Criar Conta'}
						{#if !isSubmitting}
							<ArrowRight class="h-4 w-4" />
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
</div>
