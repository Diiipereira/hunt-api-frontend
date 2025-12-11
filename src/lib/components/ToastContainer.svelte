<script lang="ts">
	import { ToastService } from '$lib/stores/toast.svelte';
	import { fly } from 'svelte/transition';
	import { CircleCheck, CircleX, CircleAlert, Info, X } from 'lucide-svelte';

	const variants = {
		success: {
			bg: 'bg-hunt-dark-500',
			border: 'border-hunt-green-100',
			highlight: 'text-hunt-green-100',
			text: 'text-hunt-light-300',
			icon: CircleCheck
		},
		error: {
			bg: 'bg-hunt-dark-500',
			border: 'border-hunt-red-200',
			highlight: 'text-hunt-red-200',
			text: 'text-hunt-light-300',
			icon: CircleX
		},
		warning: {
			bg: 'bg-hunt-dark-500',
			border: 'border-hunt-yellow-500',
			highlight: 'text-hunt-yellow-500',
			text: 'text-hunt-light-300',
			icon: CircleAlert
		},
		info: {
			bg: 'bg-hunt-dark-500',
			border: 'border-hunt-blue-200',
			highlight: 'text-hunt-blue-200',
			text: 'text-hunt-light-300',
			icon: Info
		}
	};

	function getTitle(type: string) {
		const titles: Record<string, string> = {
			info: 'Informação',
			error: 'Erro',
			success: 'Sucesso',
			warning: 'Atenção'
		};
		return titles[type] || 'Atenção';
	}
</script>

<div
	class="pointer-events-none fixed top-0 right-0 z-100 flex max-h-screen w-full flex-col items-end gap-2 p-6"
>
	{#each ToastService.toasts as toast (toast.id)}
		{@const style = variants[toast.type]}
		{@const Icon = style.icon}

		<div
			transition:fly={{ x: 200, duration: 300 }}
			class="pointer-events-auto relative flex w-full max-w-sm items-start gap-4 rounded-xl border p-4 shadow-2xl {style.bg} {style.border}"
		>
			<Icon size={24} strokeWidth={2.5} class="{style.highlight} mt-0.5 shrink-0" />

			<div class="flex-1 pr-6">
				<h4 class="text-md font-bold capitalize {style.highlight}">
					{getTitle(toast.type)}
				</h4>
				<p class="mt-1 text-sm font-medium opacity-90 {style.text}">{toast.message}</p>
			</div>

			<button
				onclick={() => ToastService.remove(toast.id)}
				class="absolute top-4 right-4 {style.text} opacity-70 transition-opacity hover:opacity-100"
			>
				<X size={18} strokeWidth={2.5} />
			</button>
		</div>
	{/each}
</div>
