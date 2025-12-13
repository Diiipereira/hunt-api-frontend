<script lang="ts">
	import { goto } from '$app/navigation';
	import { api } from '$lib/services/api';
	import { authState } from '$lib/stores/auth.svelte';
	import { superForm, defaults } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { loginSchema } from '$lib/schemas/auth';
	import Input from '$lib/components/forms/Input.svelte';
	import { CircleAlert, Lock, Mail } from 'lucide-svelte';

	const { form, errors, constraints, enhance } = superForm(
		defaults({ email: '', password: '' }, zod(loginSchema)),
		{
			SPA: true,
			validators: zod(loginSchema),
			onUpdate: async ({ form: f }) => {
				if (f.valid) await handleLogin(f.data);
			}
		}
	);

	let loginError = $state('');
	let isLoading = $state(false);

	async function handleLogin(data: typeof $form) {
		loginError = '';
		isLoading = true;
		try {
			const res = await api('/auth/signin', { method: 'POST', body: JSON.stringify(data) });
			const responseData = await res.json();
			if (!res.ok) {
				loginError = 'E-mail ou senha incorretos.';
				return;
			}
			authState.login(responseData.accessToken);
			goto('/dashboard');
		} catch (err) {
			loginError = 'Erro de conexão.';
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="bg-hunt-dark-500 flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8">
	<div
		class="bg-hunt-dark-400/20 border-hunt-purple-300/10 mx-auto w-full max-w-xs rounded-xl border p-8 sm:max-w-lg"
	>
		<div class="sm:mx-auto sm:w-full sm:max-w-sm">
			<div class="bg-hunt-purple-500 mx-auto mb-6 h-10 w-10 rotate-45 rounded-sm"></div>
			<h2 class="text-hunt-light-600 text-center text-2xl font-bold tracking-tight">
				Faça login na sua conta
			</h2>
			<p class="text-hunt-light-300 mt-2 text-center text-sm">
				Ou
				<a
					href="/signup"
					class="text-hunt-purple-400 hover:text-hunt-purple-300 font-semibold transition-colors"
				>
					Comece a sua primeira caçada agora
				</a>
			</p>
		</div>

		<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
			<form class="space-y-8" use:enhance method="POST" novalidate>
				<Input
					label="Endereço de e-mail"
					name="email"
					type="email"
					placeholder="email@exemplo.com"
					bind:value={$form.email}
					error={$errors.email}
					{...$constraints.email}
				>
					{#snippet icon()}
						<Mail class="text-hunt-light-600 h-4 w-4" />
					{/snippet}
				</Input>

				<Input
					label="Senha"
					name="password"
					type="password"
					placeholder="••••••"
					bind:value={$form.password}
					error={$errors.password}
					{...$constraints.password}
				>
					{#snippet icon()}
						<Lock class="text-hunt-light-600 h-4 w-4" />
					{/snippet}
				</Input>

				{#if loginError}
					<div
						class="animate-fade-in bg-hunt-red-300 border-hunt-red-200 text-hunt-light-600 flex items-center gap-3 rounded-md border p-3 text-sm"
					>
						<CircleAlert class="h-5 w-5 shrink-0" strokeWidth={3} />
						<p class="font-medium">{loginError}</p>
					</div>
				{/if}

				<button
					type="submit"
					disabled={isLoading}
					class="bg-hunt-purple-500 hover:bg-hunt-purple-300 text-hunt-light-300 hover:text-hunt-light-500 shadow-hunt-purple-500/20 flex w-full justify-center rounded-md px-6 py-2.5 text-sm font-bold transition-colors disabled:opacity-70"
				>
					{isLoading ? 'Entrando...' : 'Entrar'}
				</button>
			</form>

			<p class="text-hunt-light-600 mt-10 text-center text-sm">
				<a
					href="/forgot-password"
					class="text-hunt-light-700 hover:text-hunt-light-300 font-semibold transition-colors"
				>
					Esqueceu sua senha?
				</a>
			</p>
		</div>
	</div>
</div>
