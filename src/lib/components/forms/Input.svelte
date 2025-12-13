<script lang="ts">
	import { CircleAlert, Eye, EyeOff } from 'lucide-svelte';
	import type { Snippet } from 'svelte';

	let {
		label = '',
		name,
		type = 'text',
		placeholder = '',
		value = $bindable(),
		error = undefined as any,
		disabled = false,
		icon,
		...props
	}: {
		label?: string;
		name: string;
		type?: string;
		placeholder?: string;
		value: any;
		error?: any;
		disabled?: boolean;
		icon?: Snippet;
		[key: string]: any;
	} = $props();

	let showPassword = $state(false);

	// Lógica para extrair a mensagem de erro do Superforms/Zod
	let displayError = $derived.by(() => {
		if (!error) return null;
		if (Array.isArray(error)) return error[0];
		if (typeof error === 'string') return error;
		if (typeof error === 'object' && error?._errors) return error._errors[0];
		return null;
	});

	function togglePassword() {
		showPassword = !showPassword;
	}
</script>

<div class="relative w-full">
	{#if label}
		<label
			class="text-hunt-light-600 mb-1 block text-sm font-bold {disabled ? 'opacity-50' : ''}"
			for={name}
		>
			{label}
		</label>
	{/if}

	<div class="relative">
		{#if icon}
			<div
				class="text-hunt-light-600/50 pointer-events-none absolute top-1/2 left-3 flex -translate-y-1/2 items-center"
			>
				{@render icon()}
			</div>
		{/if}

		<input
			id={name}
			{name}
			{placeholder}
			{disabled}
			bind:value
			{...props}
			type={type === 'password' && showPassword ? 'text' : type}
			class="
				bg-hunt-dark-500 text-hunt-light-300 placeholder:text-hunt-light-700
				disabled:border-hunt-light-900/10 w-full rounded-md border py-2.5 transition-colors
				outline-none disabled:cursor-not-allowed disabled:opacity-50
				
				{icon ? 'pr-4 pl-10' : 'px-4'} 
				
				{displayError
				? 'border-hunt-red-300 focus:ring-hunt-red-400 focus:ring-1'
				: 'border-hunt-light-900/10 focus:border-hunt-purple-500 focus:ring-hunt-purple-500 focus:ring-1'}
			"
		/>

		{#if type === 'password' && !disabled}
			<button
				type="button"
				onclick={togglePassword}
				class="text-hunt-light-600 hover:text-hunt-light-300 absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
				tabindex="-1"
			>
				{#if showPassword}
					<EyeOff size={20} />
				{:else}
					<Eye size={20} />
				{/if}
			</button>
		{/if}

		{#if displayError && !disabled}
			<div
				class="text-hunt-red-200 absolute -bottom-5 left-0 z-10 flex items-center gap-1.5 text-xs font-medium whitespace-nowrap"
			>
				<CircleAlert class="h-3.5 w-3.5" />
				<span>{displayError}</span>
			</div>
		{/if}
	</div>
</div>
