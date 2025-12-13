<script lang="ts">
	import {
		Search,
		ChevronDown,
		Gamepad2,
		Plus,
		LoaderCircle,
		X,
		Pencil,
		Power
	} from 'lucide-svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { flip } from 'svelte/animate';
	import { fade, scale } from 'svelte/transition';
	import { ToastService } from '$lib/stores/toast.svelte';
	import { api } from '$lib/services/api';

	let { data } = $props();

	interface Provider {
		id: string | number;
		name: string;
		gameCount?: number;
		active: boolean;
		slug?: string;
	}

	let providers = $state<Provider[]>(
		data.providers.map((p: any) => ({
			...p,
			gameCount: p._count?.slots ?? p.gameCount ?? 0
		}))
	);

	let isLoading = $state(false);
	let searchQuery = $state('');
	let sortBy = $state<'name' | 'count'>('name');

	let showCreateModal = $state(false);
	let newProviderName = $state('');
	let isProviderActive = $state(true);
	let isCreating = $state(false);
	let editingProvider = $state<Provider | null>(null);

	function validateName(name: string): string | null {
		if (!name || name.trim().length < 2) {
			return 'O nome deve ter pelo menos 2 caracteres.';
		}
		const regex = /^[a-zA-Z0-9\s\-&']+$/;
		if (!regex.test(name)) {
			return 'O nome contém caracteres inválidos.';
		}
		return null;
	}

	function openCreateModal() {
		editingProvider = null;
		newProviderName = '';
		isProviderActive = true;
		showCreateModal = true;
	}

	function openEditModal(provider: Provider) {
		editingProvider = provider;
		newProviderName = provider.name;
		isProviderActive = provider.active;
		showCreateModal = true;
	}

	async function handleCreateProvider() {
		const validationError = validateName(newProviderName);
		if (validationError) {
			ToastService.warning(validationError);
			return;
		}
		isCreating = true;
		try {
			const response = await api('/providers', {
				method: 'POST',
				body: JSON.stringify({ name: newProviderName })
			});

			if (!response.ok) throw new Error('Falha ao criar');
			const newProv = await response.json();
			const added = newProv.data || newProv;

			providers = [...providers, { ...added, active: true }];
			ToastService.success('Provedora adicionada!');
			showCreateModal = false;
		} catch (error) {
			ToastService.error('Erro ao criar provedora');
		} finally {
			isCreating = false;
		}
	}

	async function handleUpdateLogic() {
		if (!editingProvider) return;

		const validationError = validateName(newProviderName);
		if (validationError) {
			ToastService.warning(validationError);
			return;
		}

		isCreating = true;
		let hasError = false;
		try {
			if (newProviderName !== editingProvider.name) {
				const resName = await api(`/providers/${editingProvider.id}`, {
					method: 'PATCH',
					body: JSON.stringify({ name: newProviderName })
				});
				if (!resName.ok) throw new Error('Falha ao atualizar nome');
			}

			if (isProviderActive !== editingProvider.active) {
				if (isProviderActive) {
					const resActive = await api(`/providers/${editingProvider.id}/activate`, {
						method: 'PATCH'
					});
					if (!resActive.ok) throw new Error('Falha ao reativar');
				} else {
					const resDeactivate = await api(`/providers/${editingProvider.id}`, {
						method: 'DELETE'
					});
					if (!resDeactivate.ok) throw new Error('Falha ao desativar');
				}
			}

			providers = providers.map((p) =>
				p.id === editingProvider!.id ? { ...p, name: newProviderName, active: isProviderActive } : p
			);
			ToastService.success('Provedora atualizada com sucesso!');
			showCreateModal = false;
		} catch (error) {
			console.error(error);
			ToastService.error('Erro ao processar alterações.');
			hasError = true;
		} finally {
			isCreating = false;
			if (!hasError) editingProvider = null;
		}
	}

	function handleSubmit() {
		if (editingProvider) {
			handleUpdateLogic();
		} else {
			handleCreateProvider();
		}
	}

	let filteredProviders = $derived(
		providers
			.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
			.sort((a, b) => {
				if (sortBy === 'name') return a.name.localeCompare(b.name);
				return (b.gameCount || 0) - (a.gameCount || 0);
			})
	);
</script>

<div class="mx-auto max-w-7xl p-6">
	<div class="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
		<div>
			<h1 class="text-hunt-light-300 text-3xl font-extrabold">Provedoras de Jogos</h1>
			<p class="text-hunt-light-600 mt-1 font-medium">
				Gerencie e explore as provedoras disponíveis.
			</p>
		</div>
		<button
			onclick={openCreateModal}
			class="bg-hunt-purple-500 hover:bg-hunt-purple-300 text-hunt-light-300 flex items-center gap-2 rounded-lg px-6 py-3 font-bold shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
		>
			<Plus size={20} strokeWidth={3} />
			Adicionar
		</button>
	</div>

	<div class="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center">
		<div class="relative flex-1">
			<Search class="text-hunt-light-500 absolute top-1/2 left-4 -translate-y-1/2" size={20} />
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Buscar provedoras..."
				class="bg-hunt-dark-400/40 border-hunt-light-900/10 text-hunt-light-300 placeholder:text-hunt-light-600 focus:border-hunt-purple-300 focus:ring-hunt-purple-500 w-full rounded-xl border py-3.5 pr-4 pl-12 font-medium transition-colors outline-none focus:ring-1"
			/>
		</div>

		<div class="flex gap-3">
			<button
				onclick={() => (sortBy = 'name')}
				class="min-w-140px flex items-center justify-between gap-3 rounded-xl border px-5 py-3.5 text-sm font-bold transition-all active:scale-95 {sortBy ===
				'name'
					? 'bg-hunt-purple-500/20 border-hunt-purple-500 text-hunt-purple-300 shadow-hunt-purple-500/10 shadow-lg'
					: 'bg-hunt-dark-400 border-hunt-light-900/10 text-hunt-light-300 hover:bg-hunt-dark-300'}"
			>
				Ordem: A-Z
				<ChevronDown
					size={16}
					class="transition-transform duration-300 {sortBy === 'name'
						? 'rotate-180 opacity-100'
						: 'opacity-50'}"
				/>
			</button>

			<button
				onclick={() => (sortBy = 'count')}
				class="min-w-160px flex items-center justify-between gap-3 rounded-xl border px-5 py-3.5 text-sm font-bold transition-all active:scale-95 {sortBy ===
				'count'
					? 'bg-hunt-purple-500/20 border-hunt-purple-500 text-hunt-purple-300 shadow-hunt-purple-500/10 shadow-lg'
					: 'bg-hunt-dark-400 border-hunt-light-900/10 text-hunt-light-300 hover:bg-hunt-dark-300'}"
			>
				Mais Jogados
				<ChevronDown
					size={16}
					class="transition-transform duration-300 {sortBy === 'count'
						? 'rotate-180 opacity-100'
						: 'opacity-50'}"
				/>
			</button>
		</div>
	</div>

	{#if filteredProviders.length === 0}
		<div
			in:fade={{ duration: 200 }}
			class="border-hunt-light-900/10 bg-hunt-dark-400/10 flex h-64 w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed"
		>
			<Gamepad2 class="text-hunt-light-700 h-12 w-12" />
			<p class="text-hunt-light-500 font-bold">Nenhuma provedora encontrada.</p>
		</div>
	{:else}
		<div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
			{#each filteredProviders as provider (provider.id)}
				<button
					onclick={() => openEditModal(provider)}
					animate:flip={{ duration: 300 }}
					in:fade={{ duration: 200 }}
					class="bg-hunt-dark-400/20 border-hunt-light-900/10 hover:border-hunt-purple-500/50 hover:bg-hunt-dark-400/40 hover:shadow-hunt-purple-500/10 group relative flex aspect-square flex-col items-center justify-center gap-3 rounded-2xl border p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-95 {provider.active
						? ''
						: 'opacity-60 grayscale'}"
				>
					{#if !provider.active}
						<div
							class="absolute top-3 left-3 rounded bg-red-500/20 px-2 py-0.5 text-[10px] font-bold tracking-wide text-red-400 uppercase"
						>
							Inativo
						</div>
					{/if}

					<div
						class="bg-hunt-purple-500 text-hunt-light-300 absolute top-3 right-3 flex h-8 w-8 translate-y-2 items-center justify-center rounded-lg opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
					>
						<Pencil size={14} />
					</div>

					<div
						class="bg-hunt-purple-500/10 group-hover:bg-hunt-purple-500/20 mb-2 flex h-24 w-24 items-center justify-center rounded-full transition-colors"
					>
						<Gamepad2
							class="text-hunt-purple-400 group-hover:text-hunt-purple-300 transition-colors"
							size={60}
							strokeWidth={1.2}
						/>
					</div>

					<div class="flex w-full flex-col gap-1 overflow-hidden">
						<h3
							class="text-hunt-light-300 truncate text-lg font-bold transition-colors group-hover:text-white"
						>
							{provider.name}
						</h3>
						<p class="text-hunt-light-600 text-xs font-semibold tracking-wide uppercase">
							{provider.gameCount || 0}
							{provider.gameCount === 1 ? 'Jogo' : 'Jogos'}
						</p>
					</div>
				</button>
			{/each}
		</div>
	{/if}
</div>

{#if showCreateModal}
	<div
		transition:fade={{ duration: 200 }}
		class="bg-hunt-dark-500/80 fixed inset-0 z-50 flex cursor-default items-center justify-center backdrop-blur-sm"
		role="button"
		tabindex="0"
		onclick={() => !isCreating && (showCreateModal = false)}
		onkeydown={(e) => e.key === 'Escape' && !isCreating && (showCreateModal = false)}
		aria-label="Fechar modal"
	>
		<div
			transition:scale={{ duration: 200, start: 0.95 }}
			class="bg-hunt-dark-500 border-hunt-purple-500/10 w-full max-w-md cursor-auto rounded-2xl border p-6 text-left shadow-2xl"
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
			tabindex="-1"
		>
			<div class="mb-6 flex items-center justify-between">
				<h2 id="modal-title" class="text-hunt-light-300 text-xl font-bold">
					{editingProvider ? 'Editar Provedora' : 'Adicionar Provedora'}
				</h2>
				<button
					type="button"
					onclick={() => (showCreateModal = false)}
					disabled={isCreating}
					class="text-hunt-light-500 hover:text-hunt-light-300 cursor-pointer transition-colors disabled:opacity-50"
					aria-label="Fechar"
				>
					<X size={24} />
				</button>
			</div>

			<div class="space-y-6">
				<div class="space-y-2">
					<label for="providerName" class="text-hunt-light-600 ml-1 text-sm font-bold"
						>Nome da Provedora</label
					>
					<input
						id="providerName"
						type="text"
						bind:value={newProviderName}
						placeholder="Ex: Pragmatic Play"
						class="bg-hunt-dark-400/20 border-hunt-light-900/10 text-hunt-light-300 placeholder:text-hunt-light-700 focus:border-hunt-purple-500 focus:ring-hunt-purple-500 w-full rounded-xl border px-4 py-3 font-medium transition-colors outline-none focus:ring-1"
						disabled={isCreating}
						autocomplete="off"
					/>
				</div>

				{#if editingProvider}
					<div
						class="bg-hunt-dark-400/20 border-hunt-light-900/10 flex items-center justify-between rounded-xl border p-4"
					>
						<div class="flex items-center gap-3">
							<div class="bg-hunt-dark-500 flex h-10 w-10 items-center justify-center rounded-lg">
								<Power
									size={20}
									class={isProviderActive ? 'text-hunt-green-400' : 'text-hunt-red-300'}
								/>
							</div>
							<div>
								<p class="text-hunt-light-300 text-sm font-bold">Status da Provedora</p>
								<p class="text-hunt-light-600 text-xs">
									{isProviderActive ? 'A provedora está ativa.' : 'A provedora está inativa.'}
								</p>
							</div>
						</div>

						<button
							type="button"
							role="switch"
							aria-checked={isProviderActive}
							aria-label={isProviderActive ? 'Desativar provedora' : 'Ativar provedora'}
							onclick={() => (isProviderActive = !isProviderActive)}
							class="relative h-6 w-11 cursor-pointer rounded-full transition-colors duration-300 {isProviderActive
								? 'bg-hunt-purple-500'
								: 'bg-hunt-dark-300'}"
						>
							<div
								class="absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-300 {isProviderActive
									? 'translate-x-5'
									: 'translate-x-0'}"
							></div>
						</button>
					</div>
				{/if}
			</div>

			<div class="mt-8 flex justify-end gap-3">
				<button
					type="button"
					onclick={() => (showCreateModal = false)}
					disabled={isCreating}
					class="border-hunt-light-900/10 text-hunt-light-500 hover:bg-hunt-light-600/5 hover:text-hunt-light-300 cursor-pointer rounded-lg border px-4 py-2.5 text-sm font-bold transition-colors disabled:opacity-50"
				>
					Cancelar
				</button>

				<button
					type="button"
					onclick={handleSubmit}
					disabled={isCreating}
					class="bg-hunt-purple-500 hover:bg-hunt-purple-400 text-hunt-light-300 flex cursor-pointer items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-70"
				>
					{#if isCreating}
						<LoaderCircle class="h-4 w-4 animate-spin" />
						Salvando...
					{:else}
						{editingProvider ? 'Salvar Alterações' : 'Confirmar'}
					{/if}
				</button>
			</div>
		</div>
	</div>
{/if}
