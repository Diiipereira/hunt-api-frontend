<script lang="ts">
	import { CircleAlert, Eye, EyeOff } from 'lucide-svelte';
	import type { Snippet } from 'svelte';

	let {
		label = '',
		name = '',
		type = 'text',
		placeholder = '',
		validate = (val: string) => true,
		value = $bindable(''),
		errorMessage = 'Valor Inválido',
		error = $bindable(''),
		disabled = false,
		autocomplete = 'off',
		icon
	}: {
		label?: string;
		name: string;
		type?: string;
		placeholder?: string;
		validate?: (val: string) => boolean;
		value: string;
		errorMessage?: string;
		error?: string;
		disabled?: boolean;
		autocomplete?: any;
		icon?: Snippet;
	} = $props();

	let touched = $state(false);
	let showPassword = $state(false);

	function handleInput() {
		if (error && validate(value)) {
			error = '';
		}
	}

	function handleBlur() {
		touched = true;
		if (value.trim() === '') {
			error = '';
			return;
		}
		error = validate(value) ? '' : errorMessage;
	}

	function togglePassword() {
		showPassword = !showPassword;
	}
</script>

<div class="relative w-full">
	{#if label}
		<label
			class="text-hunt-light-600 block pb-1 text-sm font-bold {disabled ? 'opacity-50' : ''}"
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
			{autocomplete}
			bind:value
			oninput={handleInput}
			onblur={handleBlur}
			type={type === 'password' && showPassword ? 'text' : type}
			class="
        bg-hunt-dark-500 text-hunt-light-300 placeholder:text-hunt-light-700
        disabled:border-hunt-light-900/10 w-full rounded-md border py-2.5 transition-colors
        outline-none disabled:cursor-not-allowed disabled:opacity-50
        
        {icon ? 'pr-4 pl-10' : 'px-4'} 
        
        {error
				? 'border-hunt-red-300 focus:ring-hunt-red-400 focus:ring-1'
				: touched && value && validate(value) && !disabled
					? 'border-hunt-green-300 focus:ring-hunt-green-300 focus:ring-1'
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

		{#if error && !disabled}
			<div
				class="
          animate-fade-in bg-hunt-red-300 text-hunt-light-300
          before:border-t-hunt-red-300 absolute -top-10 right-0 z-10 flex
          items-center gap-2 rounded-md px-3 py-1.5 text-xs
          font-medium shadow-lg before:absolute
          before:top-full before:right-4
          before:border-8 before:border-transparent
        "
			>
				<CircleAlert class="h-4 w-4" />
				<span>{error}</span>
			</div>
		{/if}
	</div>
</div>
