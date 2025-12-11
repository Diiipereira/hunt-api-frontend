<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { login } from '$lib/stores/auth';
	import ValidateInput from '$lib/components/forms/ValidateInput.svelte';
	import { validateEmail, validatePassword } from '$lib/utils/Validators';
	import { CircleAlert, Lock, Mail } from 'lucide-svelte';

	let email = $state('');
	let password = $state('');

	let emailError = $state('');
	let passwordError = $state('');
	let loginError = $state('');

	async function handleLogin(e: Event) {
		e.preventDefault();

		emailError = '';
		passwordError = '';
		loginError = '';

		if (!email) {
			emailError = 'O e-mail é obrigatório';
		} else if (!validateEmail(email)) {
			emailError = 'Por favor, informe um e-mail válido';
		}

		if (!password) {
			passwordError = 'Por favor, digite sua senha';
		} else if (!validatePassword(password)) {
			passwordError = 'Senha deve ter pelo menos 6 caracteres';
		}

		if (emailError || passwordError) return;

		try {
			const res = await fetch(`${PUBLIC_API_URL}/auth/signin`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password })
			});

			const data = await res.json();

			if (!res.ok) {
				loginError = 'E-mail ou senha incorretos. Tente novamente.';
				return;
			}

			login(data.accessToken);
			goto('/dashboard');
		} catch (err) {
			console.error(err);
			loginError = 'Não foi possível conectar ao servidor.';
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
			<form class="space-y-6" onsubmit={handleLogin} autocomplete="off">
				<ValidateInput
					label="Endereço de e-mail"
					name="email"
					type="email"
					placeholder="email@exemplo.com"
					validate={validateEmail}
					errorMessage="Por favor, informe um e-mail válido"
					bind:value={email}
					bind:error={emailError}
				>
					{#snippet icon()}
						<Mail class="text-hunt-light-600 h-4 w-4" />
					{/snippet}
				</ValidateInput>

				<ValidateInput
					label="Senha"
					name="password"
					type="password"
					placeholder="••••••"
					validate={validatePassword}
					errorMessage="Senha deve ter pelo menos 6 caracteres"
					bind:value={password}
					bind:error={passwordError}
				>
					{#snippet icon()}
						<Lock class="text-hunt-light-600 h-4 w-4" />
					{/snippet}
				</ValidateInput>

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
					class="bg-hunt-purple-500 hover:bg-hunt-purple-300 text-hunt-light-300 hover:text-hunt-light-500 shadow-hunt-purple-500/20 flex w-full
          justify-center rounded-md px-6 py-2.5 text-sm font-bold transition-colors"
				>
					Entrar
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
