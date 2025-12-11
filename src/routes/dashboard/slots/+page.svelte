<script lang="ts">
	import { Search, Funnel, Heart, Dices, Plus, X, LoaderCircle } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { scale } from 'svelte/transition';

	interface Slot {
		id: string | number;
		name: string;
		providerId: string;
		providers?: {
			name: string;
		};
		isFavorite?: boolean;
		slug?: string;
	}

	let slots = $state<Slot[]>([]);
	let isLoading = $state(true);
	let searchQuery = $state('');
	let showFavoritesOnly = $state(false);

	let selectedProvider = $state<string | null>(null);

	onMount(async () => {
		await fetchSlots();
	});

	async function fetchSlots() {
		try {
			const token = localStorage.getItem('token');
			const response = await fetch(`${PUBLIC_API_URL}/slots`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) throw new Error('Falha ao buscar slots');

			const data = await response.json();
			slots = Array.isArray(data) ? data : data.data || [];
		} catch (error) {
			console.error('Erro ao carregar slots:', error);
		} finally {
			isLoading = false;
		}
	}

	let filteredSlots = $derived(
		slots.filter((slot) => {
			const matchesSearch = slot.name.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesFavorite = showFavoritesOnly ? slot.isFavorite : true;
			const slotProviderName = slot.providers?.name || '';
			const matchesProvider = selectedProvider
				? slotProviderName.toLowerCase() === selectedProvider.toLowerCase()
				: true;

			return matchesSearch && matchesFavorite && matchesProvider;
		})
	);

	let availableProviders = $derived(
		[...new Set(slots.map((s) => s.providers?.name))]
			.filter((name): name is string => !!name)
			.sort()
	);
</script>

<div class="mx-auto max-w-7xl p-6">
	<div class="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
		<div>
			<h1 class="text-hunt-light-300 text-3xl font-extrabold">Biblioteca de Slots</h1>
			<p class="text-hunt-light-600 mt-1 font-medium">Gerencie seus jogos e favoritos.</p>
		</div>

		<button
			type="button"
			class="bg-hunt-purple-500 hover:bg-hunt-purple-300 shadow-hunt-purple-500/20 flex items-center gap-2 rounded-lg px-6 py-3 font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
		>
			<Plus size={20} strokeWidth={3} />
			Adicionar Slot
		</button>
	</div>

	<div class="mb-8 flex flex-col gap-4">
		<div class="relative w-full">
			<Search class="text-hunt-light-500 absolute top-1/2 left-4 -translate-y-1/2" size={20} />
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Buscar por nome do slot..."
				class="bg-hunt-dark-400 border-hunt-light-900/10 text-hunt-light-300 placeholder:text-hunt-light-600 focus:border-hunt-purple-500 focus:ring-hunt-purple-500 w-full rounded-xl border py-3.5 pr-4 pl-12 font-medium transition-colors outline-none focus:ring-1"
			/>
		</div>

		<div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
			<div class="flex flex-wrap items-center gap-2">
				<div
					class="bg-hunt-dark-400 border-hunt-light-900/10 text-hunt-light-300 flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-bold"
				>
					<Funnel size={16} />
					Filtros Rápidos:
				</div>

				{#if selectedProvider}
					<button
						onclick={() => (selectedProvider = null)}
						class="bg-hunt-purple-500/20 border-hunt-purple-500 text-hunt-purple-300 animate-in fade-in zoom-in flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-bold transition-colors duration-200"
					>
						{selectedProvider}
						<X size={14} class="cursor-pointer hover:text-white" />
					</button>
				{/if}

				{#each availableProviders.slice(0, 5) as provider}
					{#if provider !== selectedProvider}
						<button
							onclick={() => (selectedProvider = provider)}
							class="bg-hunt-dark-400 border-hunt-light-900/10 text-hunt-light-500 hover:text-hunt-light-300 hover:bg-hunt-dark-300 rounded-lg border px-3 py-2 text-sm font-bold transition-colors"
						>
							{provider}
						</button>
					{/if}
				{/each}
			</div>

			<div class="flex items-center gap-3">
				<Heart
					size={18}
					class={showFavoritesOnly
						? 'text-hunt-purple-400 fill-hunt-purple-400'
						: 'text-hunt-light-600'}
				/>
				<span class="text-hunt-light-300 text-sm font-bold">Apenas Favoritos</span>

				<button
					type="button"
					role="switch"
					aria-checked={showFavoritesOnly}
					aria-label={showFavoritesOnly
						? 'Desativar filtro de favoritos'
						: 'Ativar filtro de favoritos'}
					onclick={() => (showFavoritesOnly = !showFavoritesOnly)}
					class="relative h-6 w-11 cursor-pointer rounded-full transition-colors duration-300 {showFavoritesOnly
						? 'bg-hunt-purple-500'
						: 'bg-hunt-dark-300'}"
				>
					<div
						class="absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-300 {showFavoritesOnly
							? 'translate-x-5'
							: 'translate-x-0'}"
					></div>
				</button>
			</div>
		</div>
	</div>

	{#if isLoading}
		<div class="flex h-64 w-full flex-col items-center justify-center gap-4">
			<LoaderCircle class="text-hunt-purple-500 h-10 w-10 animate-spin" />
			<p class="text-hunt-light-600 animate-pulse font-bold">Carregando slots...</p>
		</div>
	{:else if filteredSlots.length === 0}
		<div
			in:scale={{ duration: 200, start: 0.95 }}
			class="border-hunt-light-900/10 bg-hunt-dark-400/10 flex h-64 w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed"
		>
			<Dices class="text-hunt-light-700 h-12 w-12" />
			<p class="text-hunt-light-500 font-bold">Nenhum slot encontrado.</p>
		</div>
	{:else}
		<div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
			{#each filteredSlots as slot (slot.id)}
				<div
					in:scale={{ duration: 200, start: 0.95 }}
					class="
            bg-hunt-dark-400/20 border-hunt-light-900/10 hover:border-hunt-purple-500/50 hover:bg-hunt-dark-400/40 hover:shadow-hunt-purple-500/10
            group relative flex aspect-4/3 flex-col justify-between rounded-xl border p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
          "
				>
					<div class="relative z-10 flex justify-end">
						<button
							type="button"
							aria-label={slot.isFavorite
								? `Remover ${slot.name} dos favoritos`
								: `Adicionar ${slot.name} aos favoritos`}
							class="text-hunt-light-600 hover:text-hunt-red-400 transition-all hover:scale-110"
						>
							<Heart
								size={20}
								class={slot.isFavorite ? 'fill-hunt-red-400 text-hunt-red-400' : ''}
							/>
						</button>
					</div>

					<div
						class="pointer-events-none absolute inset-0 flex items-center justify-center opacity-10 transition-opacity group-hover:opacity-20"
					>
						<Dices size={64} class="text-hunt-purple-500 rotate-12" />
					</div>

					<div class="relative z-10">
						<h3
							class="text-hunt-light-300 text-md truncate leading-tight font-bold transition-colors group-hover:text-white"
						>
							{slot.name}
						</h3>
						<p
							class="text-hunt-light-600 mt-1 truncate text-xs font-semibold tracking-wide uppercase"
						>
							{slot.providers?.name || 'Sem Provedora'}
						</p>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
