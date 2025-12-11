<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_API_URL } from '$env/static/public';
	import ValidateInput from '$lib/components/forms/ValidateInput.svelte';
	import { validateEmail, validatePassword } from '$lib/utils/Validators';
	import { User, Mail, Lock, CircleAlert, ArrowRight } from 'lucide-svelte';

	let username = $state('');
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');

	let usernameError = $state('');
	let emailError = $state('');
	let passwordError = $state('');
	let confirmPasswordError = $state('');

	let errorMessage = $state('');
	let isSubmitting = $state(false);

	const validateUsername = (val: string) => val.trim().length >= 3;

	async function handleSignup(event: Event) {
		event.preventDefault();

		errorMessage = '';
		usernameError = '';
		emailError = '';
		passwordError = '';
		confirmPasswordError = '';

		// 2. Validações Locais
		let hasError = false;

		if (!validateUsername(username)) {
			usernameError = 'Mínimo de 3 caracteres';
			hasError = true;
		}

		if (!validateEmail(email)) {
			emailError = 'E-mail inválido';
			hasError = true;
		}

		if (!validatePassword(password)) {
			passwordError = 'Mínimo de 6 caracteres';
			hasError = true;
		}

		// Validação especial: Comparar senhas
		if (password !== confirmPassword) {
			confirmPasswordError = 'As senhas não coincidem';
			hasError = true;
		}

		if (hasError) return;

		// 3. Envio para API
		isSubmitting = true;

		try {
			const response = await fetch(`${PUBLIC_API_URL}/auth/signup`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userName: username, email, password })
			});

			const data = await response.json();

			if (!response.ok) {
				// Tratamento específico para conflitos (409)
				if (response.status === 409) {
					throw new Error('Este e-mail ou usuário já está em uso.');
				}
				throw new Error(data.message || 'Erro ao criar conta.');
			}

			// Sucesso! Redireciona para o login com flag de sucesso
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
			<form class="space-y-5" onsubmit={handleSignup} autocomplete="off">
				<ValidateInput
					label="Nome de usuário"
					name="username"
					placeholder="Ex: BonusHunt"
					autocomplete="username"
					validate={validateUsername}
					errorMessage="Mínimo de 3 caracteres"
					bind:value={username}
					bind:error={usernameError}
				>
					{#snippet icon()}
						<User class="text-hunt-light-400 h-4 w-4" />
					{/snippet}
				</ValidateInput>

				<ValidateInput
					label="Endereço de e-mail"
					name="email"
					type="email"
					placeholder="email@exemplo.com"
					autocomplete="email"
					validate={validateEmail}
					errorMessage="E-mail inválido"
					bind:value={email}
					bind:error={emailError}
				>
					{#snippet icon()}
						<Mail class="text-hunt-light-400 h-4 w-4" />
					{/snippet}
				</ValidateInput>

				<div class="grid grid-cols-1 gap-5 md:grid-cols-2">
					<ValidateInput
						label="Senha"
						name="password"
						type="password"
						placeholder="••••••"
						autocomplete="new-password"
						validate={validatePassword}
						errorMessage="Mín. 6 caracteres"
						bind:value={password}
						bind:error={passwordError}
					>
						{#snippet icon()}
							<Lock class="text-hunt-light-400 h-4 w-4" />
						{/snippet}
					</ValidateInput>

					<ValidateInput
						label="Confirmar"
						name="confirm-password"
						type="password"
						placeholder="••••••"
						autocomplete="new-password"
						bind:value={confirmPassword}
						bind:error={confirmPasswordError}
					>
						{#snippet icon()}
							<Lock class="text-hunt-light-400 h-4 w-4" />
						{/snippet}
					</ValidateInput>
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
