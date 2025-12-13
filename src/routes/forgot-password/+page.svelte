<script lang="ts">
	import { api } from '$lib/services/api';
	import { superForm, defaults } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { forgotPasswordSchema } from '$lib/schemas/auth';
	import Input from '$lib/components/forms/Input.svelte';
	import { CircleAlert, CircleCheck, ArrowLeft, Mail } from 'lucide-svelte';

	const { form, errors, constraints, enhance } = superForm(
		defaults({ email: '' }, zod(forgotPasswordSchema)),
		{
			SPA: true,
			validators: zod(forgotPasswordSchema),
			onUpdate: async ({ form: f }) => {
				if (f.valid) {
					await handleRecover(f.data);
				}
			}
		}
	);

	let errorMessage = $state('');
	let successMessage = $state(false);
	let isLoading = $state(false);

	async function handleRecover(data: typeof $form) {
		errorMessage = '';
		isLoading = true;

		try {
			const res = await api('/auth/forgot-password', {
				method: 'POST',
				body: JSON.stringify(data)
			});

			if (!res.ok) {
				const resData = await res.json();
				throw new Error(resData.message || 'Erro ao recuperar senha.');
			}

			successMessage = true;
		} catch (err: any) {
			console.error(err);
			errorMessage = err.message || 'Falha na conexão.';
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
				class="bg-hunt-purple-400 mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-lg shadow-lg"
			>
				<Mail class="text-hunt-light-600 h-6 w-6" />
			</div>

			<h2 class="text-hunt-light-600 text-center text-2xl font-bold tracking-tight">
				Recuperar Senha
			</h2>

			{#if !successMessage}
				<p class="text-hunt-light-300 mt-2 text-center text-sm">
					Informe seu e-mail para receber as instruções de redefinição.
				</p>
			{/if}
		</div>

		<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
			{#if successMessage}
				<div class="animate-fade-in text-center">
					<div class="bg-hunt-purple-500/10 border-hunt-purple-500/20 mb-6 rounded-lg border p-4">
						<div class="flex flex-col items-center gap-3">
							<CircleCheck class="text-hunt-purple-400 h-10 w-10" />
							<h3 class="text-hunt-light-600 font-semibold">E-mail enviado!</h3>
							<p class="text-hunt-light-400 text-sm">
								Se uma conta existir para <strong class="text-hunt-purple-300">{$form.email}</strong
								>, você receberá um link para redefinir sua senha em instantes.
							</p>
						</div>
					</div>

					<a
						href="/signin"
						class="text-hunt-light-500 hover:text-hunt-purple-300 flex items-center justify-center gap-2 text-sm font-semibold transition-colors"
					>
						<ArrowLeft class="h-4 w-4" />
						Voltar para o login
					</a>
				</div>
			{:else}
				<form class="space-y-8" use:enhance method="POST" novalidate>
					<Input
						label="E-mail cadastrado"
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

					{#if errorMessage}
						<div
							class="animate-fade-in bg-hunt-red-300 border-hunt-red-200 text-hunt-light-600 flex items-center gap-3 rounded-md border p-3 text-sm"
						>
							<CircleAlert class="h-5 w-5 shrink-0" strokeWidth={3} />
							<p class="font-medium">{errorMessage}</p>
						</div>
					{/if}

					<button
						type="submit"
						disabled={isLoading}
						class="bg-hunt-purple-500 hover:bg-hunt-purple-300 text-hunt-light-300 hover:text-hunt-light-500 shadow-hunt-purple-500/20 flex w-full justify-center rounded-md px-6 py-2.5 text-sm font-bold transition-colors disabled:opacity-50"
					>
						{isLoading ? 'Enviando...' : 'Enviar link de recuperação'}
					</button>
				</form>

				<p class="text-hunt-light-600 mt-10 text-center text-sm">
					Lembrou sua senha?
					<a
						href="/signin"
						class="text-hunt-purple-300 hover:text-hunt-purple-300 font-semibold transition-colors"
					>
						Entrar
					</a>
				</p>
			{/if}
		</div>
	</div>
</div>
