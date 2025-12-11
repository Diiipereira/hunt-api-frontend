<script lang="ts">
	import { Bell, Shield, Globe, Smartphone, Trash2, ChevronRight, Mail, Moon } from 'lucide-svelte';

	// Estados dos Toggles
	let emailMarketing = $state(true);
	let securityAlerts = $state(true);
	let twoFactorEnabled = $state(false);
	let selectedCurrency = $state('BRL');
	let selectedLanguage = $state('pt-BR');
</script>

<div class="mx-auto max-w-7xl p-6">
	<div class="mb-10">
		<h1 class="text-hunt-light-300 text-3xl font-extrabold">Configurações</h1>
		<p class="text-hunt-light-600 mt-1 font-medium">
			Gerencie suas preferências de aplicativo e segurança.
		</p>
	</div>

	<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
		<div
			class="bg-hunt-dark-400/20 border-hunt-light-900/10 flex flex-col gap-6 rounded-2xl border p-6 shadow-xl"
		>
			<div class="border-hunt-light-900/5 flex items-center gap-3 border-b pb-4">
				<div class="bg-hunt-purple-500/10 flex h-10 w-10 items-center justify-center rounded-lg">
					<Globe class="text-hunt-purple-400" size={20} />
				</div>
				<div>
					<h2 class="text-hunt-light-300 text-lg font-bold">Geral</h2>
					<p class="text-hunt-light-600 text-xs font-medium">Idioma e Região</p>
				</div>
			</div>

			<div class="space-y-2">
				<label for="lang" class="text-hunt-light-300 text-sm font-bold">Idioma do Sistema</label>
				<div class="relative">
					<select
						id="lang"
						bind:value={selectedLanguage}
						class="bg-hunt-dark-500 border-hunt-light-900/10 text-hunt-light-300 focus:border-hunt-purple-500 focus:ring-hunt-purple-500 w-full appearance-none rounded-xl border px-4 py-3 text-sm font-medium transition-all outline-none"
					>
						<option value="pt-BR">Português (Brasil)</option>
						<option value="en-US">English (US)</option>
						<option value="es">Español</option>
					</select>
					<ChevronRight
						class="text-hunt-light-600 absolute top-1/2 right-4 -translate-y-1/2 rotate-90"
						size={16}
					/>
				</div>
			</div>

			<div class="space-y-2">
				<label for="currency" class="text-hunt-light-300 text-sm font-bold">Moeda Padrão</label>
				<div class="relative">
					<select
						id="currency"
						bind:value={selectedCurrency}
						class="bg-hunt-dark-500 border-hunt-light-900/10 text-hunt-light-300 focus:border-hunt-purple-500 focus:ring-hunt-purple-500 w-full appearance-none rounded-xl border px-4 py-3 text-sm font-medium transition-all outline-none"
					>
						<option value="BRL">BRL (R$)</option>
						<option value="USD">USD ($)</option>
						<option value="EUR">EUR (€)</option>
					</select>
					<ChevronRight
						class="text-hunt-light-600 absolute top-1/2 right-4 -translate-y-1/2 rotate-90"
						size={16}
					/>
				</div>
			</div>
		</div>

		<div
			class="bg-hunt-dark-400/20 border-hunt-light-900/10 flex flex-col gap-6 rounded-2xl border p-6 shadow-xl"
		>
			<div class="border-hunt-light-900/5 flex items-center gap-3 border-b pb-4">
				<div class="bg-hunt-purple-500/10 flex h-10 w-10 items-center justify-center rounded-lg">
					<Bell class="text-hunt-purple-400" size={20} />
				</div>
				<div>
					<h2 class="text-hunt-light-300 text-lg font-bold">Notificações</h2>
					<p class="text-hunt-light-600 text-xs font-medium">Gerencie seus alertas</p>
				</div>
			</div>

			<div class="flex items-center justify-between">
				<div class="flex items-center gap-3">
					<div class="bg-hunt-dark-500 flex h-8 w-8 items-center justify-center rounded-full">
						<Mail size={14} class="text-hunt-light-500" />
					</div>
					<div>
						<p class="text-hunt-light-300 text-sm font-bold">E-mails de Marketing</p>
						<p class="text-hunt-light-600 text-xs">Novidades e promoções</p>
					</div>
				</div>

				<button
					type="button"
					role="switch"
					aria-checked={emailMarketing}
					aria-label={emailMarketing
						? 'Desativar e-mails de marketing'
						: 'Ativar e-mails de marketing'}
					onclick={() => (emailMarketing = !emailMarketing)}
					class="relative h-6 w-11 cursor-pointer rounded-full transition-colors duration-300 {emailMarketing
						? 'bg-hunt-purple-500'
						: 'bg-hunt-dark-300'}"
				>
					<div
						class="absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-300 {emailMarketing
							? 'translate-x-5'
							: 'translate-x-0'}"
					></div>
				</button>
			</div>

			<div class="flex items-center justify-between">
				<div class="flex items-center gap-3">
					<div class="bg-hunt-dark-500 flex h-8 w-8 items-center justify-center rounded-full">
						<Shield size={14} class="text-hunt-light-500" />
					</div>
					<div>
						<p class="text-hunt-light-300 text-sm font-bold">Alertas de Segurança</p>
						<p class="text-hunt-light-600 text-xs">Login em novo dispositivo</p>
					</div>
				</div>

				<button
					type="button"
					role="switch"
					aria-checked={securityAlerts}
					aria-label={securityAlerts
						? 'Desativar alertas de segurança'
						: 'Ativar alertas de segurança'}
					onclick={() => (securityAlerts = !securityAlerts)}
					class="relative h-6 w-11 cursor-pointer rounded-full transition-colors duration-300 {securityAlerts
						? 'bg-hunt-purple-500'
						: 'bg-hunt-dark-300'}"
				>
					<div
						class="absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-300 {securityAlerts
							? 'translate-x-5'
							: 'translate-x-0'}"
					></div>
				</button>
			</div>
		</div>

		<div
			class="bg-hunt-dark-400/20 border-hunt-light-900/10 flex flex-col gap-6 rounded-2xl border p-6 shadow-xl lg:col-span-2"
		>
			<div class="border-hunt-light-900/5 flex items-center gap-3 border-b pb-4">
				<div class="bg-hunt-purple-500/10 flex h-10 w-10 items-center justify-center rounded-lg">
					<Smartphone class="text-hunt-purple-400" size={20} />
				</div>
				<div>
					<h2 class="text-hunt-light-300 text-lg font-bold">Segurança</h2>
					<p class="text-hunt-light-600 text-xs font-medium">Proteja sua conta</p>
				</div>
			</div>

			<div class="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
				<div>
					<h3 class="text-hunt-light-300 font-bold">Autenticação de Dois Fatores (2FA)</h3>
					<p class="text-hunt-light-600 mt-1 max-w-lg text-sm">
						Adicione uma camada extra de segurança à sua conta exigindo um código de acesso ao fazer
						login.
					</p>
				</div>

				{#if twoFactorEnabled}
					<button
						class="border-hunt-red-300 text-hunt-light-500 hover:bg-hunt-red-300 rounded-lg border px-4 py-2 text-sm font-bold transition-colors"
					>
						Desativar 2FA
					</button>
				{:else}
					<button
						onclick={() => (twoFactorEnabled = true)}
						class="bg-hunt-purple-500 hover:bg-hunt-purple-400 text-hunt-light-300 rounded-lg px-4 py-2 text-sm font-bold shadow-sm transition-colors"
					>
						Ativar 2FA
					</button>
				{/if}
			</div>
		</div>

		<div
			class="border-hunt-light-900/10 bg-hunt-dark-400/20 flex flex-col gap-6 rounded-2xl border p-6 lg:col-span-2"
		>
			<div class="flex items-start justify-between gap-4">
				<div class="flex gap-4">
					<div
						class="bg-hunt-red-400/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
					>
						<Trash2 class="text-hunt-red-200" size={20} />
					</div>
					<div>
						<h2 class="text-hunt-light-300 text-lg font-bold">Excluir Conta</h2>
						<p class="text-hunt-light-600 mt-1 max-w-xl text-sm">
							Esta ação é permanente e não pode ser desfeita. Todos os seus dados, hunts e histórico
							serão apagados.
						</p>
					</div>
				</div>

				<button
					class="bg-hunt-red-300 hover:bg-hunt-red-400 text-hunt-light-300 shrink-0 rounded-lg px-4 py-2 text-sm font-bold shadow-sm transition-colors"
				>
					Excluir minha conta
				</button>
			</div>
		</div>
	</div>
</div>
