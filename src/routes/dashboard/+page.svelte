<script lang="ts">
	import { Plus, Funnel, ArrowRight, Zap, Dices, PiggyBank, ChevronDown } from 'lucide-svelte';

	const activeHunts = [
		{
			id: 1,
			title: 'Ganhos Épicos 2024',
			isFeatured: true,
			progress: 72,
			totalBonuses: 25,
			slotsOpened: 18,
			totalSlots: 25,
			currentWin: 8950,
			targetWin: 10000,
			status: 'active'
		},
		{
			id: 2,
			title: 'Altas Apostas',
			isFeatured: false,
			progress: 50,
			totalBonuses: 10,
			slotsOpened: 5,
			totalSlots: 10,
			currentWin: 53100,
			targetWin: 50000,
			status: 'active'
		},
		{
			id: 3,
			title: 'Especial Nolimit City',
			isFeatured: false,
			progress: 70,
			totalBonuses: 10,
			slotsOpened: 7,
			totalSlots: 10,
			currentWin: 2310,
			targetWin: 5000,
			status: 'active'
		},
		{
			id: 4,
			title: 'Sorteio Pragmatic Play',
			isFeatured: false,
			progress: 25,
			totalBonuses: 20,
			slotsOpened: 5,
			totalSlots: 20,
			currentWin: 4310,
			targetWin: 5000,
			status: 'active'
		},
		{
			id: 5,
			title: 'Caçada de Natal',
			isFeatured: false,
			progress: 100,
			totalBonuses: 30,
			slotsOpened: 30,
			totalSlots: 30,
			currentWin: 25000,
			targetWin: 5000,
			status: 'active'
		}
	];

	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
	};
</script>

<div class="mx-auto max-w-7xl p-6">
	<div class="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
		<div>
			<h1 class="text-hunt-light-300 text-3xl font-extrabold">Dashboard</h1>
			<p class="text-hunt-light-600 mt-1 font-medium">
				Bem-vindo de volta, vamos rastrear algumas vitórias!
			</p>
		</div>

		<button
			class="bg-hunt-purple-500 hover:bg-hunt-purple-400 shadow-hunt-purple-500/20 flex items-center gap-2 rounded-lg px-6 py-3 font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0"
		>
			<Plus size={20} strokeWidth={3} />
			Nova Caçada
		</button>
	</div>

	<div class="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
		<h2 class="text-hunt-light-300 text-xl font-bold">Caçadas Ativas</h2>

		<div class="flex flex-wrap items-center gap-3">
			<button
				class="bg-hunt-dark-400 border-hunt-light-900/10 text-hunt-light-500 hover:text-hunt-light-300 hover:bg-hunt-dark-300 flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-bold transition-colors"
			>
				<Funnel size={16} />
				Filtrar
			</button>

			<div
				class="bg-hunt-dark-400 border-hunt-light-900/10 flex items-center rounded-lg border p-1"
			>
				<button
					class="bg-hunt-purple-500 text-hunt-light-300 rounded px-4 py-1.5 text-xs font-bold shadow-md transition-all"
				>
					Tudo
				</button>
				<button
					class="text-hunt-light-600 hover:text-hunt-light-300 hover:bg-hunt-light-900/5 rounded px-4 py-1.5 text-xs font-bold transition-colors"
				>
					Apostas Altas
				</button>
				<button
					class="text-hunt-light-600 hover:text-hunt-light-300 hover:bg-hunt-light-900/5 rounded px-4 py-1.5 text-xs font-bold transition-colors"
				>
					Apostas Baixas
				</button>
			</div>

			<button
				class="bg-hunt-dark-400 border-hunt-light-900/10 text-hunt-light-500 hover:text-hunt-light-300 hover:bg-hunt-dark-300 flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-bold transition-colors"
			>
				Classificar por
				<ChevronDown size={16} />
			</button>
		</div>
	</div>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each activeHunts as hunt}
			<div
				class="
          relative flex flex-col justify-between rounded-2xl border p-6 shadow-xl transition-all
          {hunt.isFeatured
					? 'bg-hunt-dark-400/20 border-hunt-purple-500/30 shadow-hunt-purple-500/5 md:col-span-2'
					: 'bg-hunt-dark-400/20 border-hunt-light-900/5 hover:border-hunt-light-900/20'}
        "
			>
				<div>
					<div class="mb-6 flex items-start justify-between">
						<div>
							{#if hunt.isFeatured}
								<span
									class="text-hunt-purple-300 mb-2 block text-xs font-extrabold tracking-wider uppercase"
								>
									MAIS RECENTE
								</span>
							{/if}
							<h3 class="text-hunt-light-300 text-xl font-bold">{hunt.title}</h3>
						</div>

						{#if hunt.isFeatured}
							<div
								class="bg-hunt-purple-500/10 flex h-10 w-10 items-center justify-center rounded-lg"
							>
								<Zap class="text-hunt-purple-400" size={20} fill="currentColor" />
							</div>
						{/if}
					</div>

					<div class="mb-8 space-y-2">
						<div class="bg-hunt-light-900/10 h-3 w-full overflow-hidden rounded-full">
							<div
								class="bg-hunt-purple-500 h-full rounded-full transition-all duration-500 ease-out"
								style="width: {hunt.progress}%"
							></div>
						</div>
						<div class="mt-1 flex justify-between text-xs font-bold">
							<span class="text-hunt-light-600">Progresso</span>
							<span class="text-hunt-light-300">{hunt.progress}%</span>
						</div>
					</div>

					<div class="mb-8 grid grid-cols-2 gap-4">
						<div class="flex flex-col gap-1.5">
							<div class="text-hunt-light-600 flex items-center gap-2">
								<Dices size={20} class="text-hunt-blue-200" />
								<span class="text-xs font-bold uppercase">Slots:</span>
							</div>
							<p class="text-hunt-light-300 ml-6 text-sm font-bold">
								{hunt.slotsOpened}/{hunt.totalSlots}
								<span class="text-xs font-normal opacity-70">Aberto</span>
							</p>
						</div>

						<div class="flex flex-col gap-1.5">
							<div class="text-hunt-light-600 flex items-center gap-2">
								<PiggyBank size={20} class="text-hunt-yellow-300" />
								<span class="text-xs font-bold uppercase">GANHO:</span>
							</div>
							<p class="text-hunt-light-300 ml-6 font-mono text-sm font-bold">
								<span
									class={hunt.currentWin >= hunt.targetWin
										? 'text-hunt-green-300'
										: 'text-hunt-red-200'}
								>
									{formatCurrency(hunt.currentWin)}
								</span>
								<span class="text-hunt-light-700 text-xs"> / {formatCurrency(hunt.targetWin)}</span>
							</p>
						</div>
					</div>
				</div>

				{#if hunt.isFeatured}
					<button
						class="bg-hunt-purple-500 hover:bg-hunt-purple-400 shadow-hunt-purple-500/20 text-hunt-light-300 flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold shadow-lg transition-all hover:-translate-y-0.5"
					>
						Continuar Caçada
						<ArrowRight size={18} />
					</button>
				{:else}
					<button
						class="bg-hunt-light-900/5 hover:bg-hunt-light-900/10 text-hunt-light-600 hover:text-hunt-light-300 hover:border-hunt-light-900/10 flex w-full items-center justify-center gap-2 rounded-lg border border-transparent py-3 text-sm font-bold transition-all"
					>
						Continuar Caçada
					</button>
				{/if}
			</div>
		{/each}
	</div>
</div>
