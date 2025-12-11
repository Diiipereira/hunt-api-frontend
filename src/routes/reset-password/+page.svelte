<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { PUBLIC_API_URL } from '$env/static/public';
	import ValidateInput from '$lib/components/forms/ValidateInput.svelte';
	import { validatePassword } from '$lib/utils/Validators'; // Supondo que você tenha ou crie esse validator
	import { CircleAlert, CircleCheck, Lock, KeyRound, ArrowRight } from 'lucide-svelte';

	// O token vem da URL
	let token = $state('');

	let password = $state('');
	let confirmPassword = $state('');

	let passwordError = $state('');
	let confirmPasswordError = $state('');

	let errorMessage = $state('');
	let successMessage = $state(false);
	let isLoading = $state(false);

	// Pega o token da URL assim que a página carrega
	onMount(() => {
		token = $page.url.searchParams.get('token') || '';

		// Se não tiver token, manda o usuário embora (ou mostra erro)
		if (!token) {
			errorMessage = 'Link inválido ou incompleto.';
		}
	});

	async function handleReset(e: Event) {
		e.preventDefault();
		passwordError = '';
		confirmPasswordError = '';
		errorMessage = '';

		// Validações locais
		if (!password) passwordError = 'A senha é obrigatória';
		else if (!validatePassword(password)) passwordError = 'A senha deve ter no mínimo 6 caracteres'; // Ajuste conforme sua regra

		if (password !== confirmPassword) {
			confirmPasswordError = 'As senhas não coincidem';
		}

		if (passwordError || confirmPasswordError || !token) return;

		isLoading = true;

		try {
			const res = await fetch(`${PUBLIC_API_URL}/auth/reset-password`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ token, password })
			});

			if (!res.ok) {
				if (res.status === 404 || res.status === 400) {
					errorMessage =
						'Este link é inválido ou já expirou. Solicite um novo link de redefinição de senha.';
				} else if (res.status === 429) {
					errorMessage = 'Muitas tentativas. Tente novamente em alguns minutos.';
				} else {
					errorMessage = 'Ocorreu um erro inesperado. Tente novamente.';
				}
				return;
			}

			successMessage = true;

			// Redireciona após 5 segundos
			setTimeout(() => goto('/signin'), 5000);
		} catch (err) {
			console.error(err);
			errorMessage = 'Falha na conexão com o servidor.';
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="bg-hunt-dark-500 flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8">
	<div
		class="bg-hunt-dark-400/20 border-hunt-purple-300/10 mx-auto w-full max-w-xs rounded-xl border p-8 sm:max-w-lg"
	>
		<div class="text-center sm:mx-auto sm:w-full sm:max-w-sm">
			<div
				class="bg-hunt-purple-400 shadow-hunt-purple-500/20 mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-lg shadow-lg"
			>
				<KeyRound class="text-hunt-light-600 h-6 w-6" />
			</div>

			<h2 class="text-hunt-light-600 text-center text-2xl font-bold tracking-tight">Nova Senha</h2>

			{#if !successMessage}
				<p class="text-hunt-light-300 mt-2 text-center text-sm">
					Crie uma nova senha segura para sua conta.
				</p>
			{/if}
		</div>

		<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
			{#if successMessage}
				<div class="animate-fade-in text-center">
					<div class="bg-hunt-purple-500/10 border-hunt-purple-500/20 mb-6 rounded-lg border p-4">
						<div class="flex flex-col items-center gap-3">
							<CircleCheck class="text-hunt-purple-400 h-10 w-10" />
							<h3 class="text-hunt-light-600 font-semibold">Senha Alterada!</h3>
							<p class="text-hunt-light-400 text-sm">
								Sua senha foi redefinida com sucesso. Você será redirecionado para o login.
							</p>
						</div>
					</div>

					<a
						href="/signin"
						class="bg-hunt-purple-500 hover:bg-hunt-purple-300 text-hunt-light-300 flex w-full items-center justify-center gap-2 rounded-md py-2.5 text-sm font-bold transition-colors"
					>
						Ir para Login
						<ArrowRight class="h-4 w-4" />
					</a>
				</div>
			{:else}
				<form class="space-y-6" onsubmit={handleReset} autocomplete="off">
					<ValidateInput
						label="Nova senha"
						name="password"
						type="password"
						placeholder="••••••••"
						validate={validatePassword}
						errorMessage="Mínimo de 6 caracteres"
						bind:value={password}
						bind:error={passwordError}
					>
						{#snippet icon()}
							<Lock class="text-hunt-light-600 h-4 w-4" />
						{/snippet}
					</ValidateInput>

					<div class="relative">
						<ValidateInput
							label="Confirmar senha"
							name="confirmPassword"
							type="password"
							placeholder="••••••••"
							bind:value={confirmPassword}
							bind:error={confirmPasswordError}
						>
							{#snippet icon()}
								<Lock class="text-hunt-light-600 h-4 w-4" />
							{/snippet}
						</ValidateInput>
					</div>

					{#if errorMessage}
						<div class="animate-fade-in flex flex-col gap-4">
							<div
								class="bg-hunt-red-300 border-hunt-red-200 text-hunt-light-300 flex items-center gap-3 rounded-md border p-3 text-sm"
							>
								<CircleAlert class="h-5 w-5 shrink-0" strokeWidth={2.5} />
								<p class="font-medium">{errorMessage}</p>
							</div>

							<a
								href="/forgot-password"
								class="bg-hunt-dark-400 hover:bg-hunt-dark-300 text-hunt-light-300 flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium transition-colors"
							>
								Solicitar novo link
							</a>
						</div>
					{/if}

					<button
						type="submit"
						disabled={isLoading || !token}
						class="bg-hunt-purple-500 hover:bg-hunt-purple-300 text-hunt-light-300 hover:text-hunt-light-500 shadow-hunt-purple-500/20 flex w-full justify-center rounded-md px-6 py-2.5 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
					>
						{isLoading ? 'Redefinindo...' : 'Redefinir Senha'}
					</button>
				</form>
			{/if}
		</div>
	</div>
</div>
