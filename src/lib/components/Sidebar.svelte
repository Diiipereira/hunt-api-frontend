<script lang="ts">
	import { page } from '$app/state';
	import {
		Settings,
		LogOut,
		LayoutDashboard,
		CircleUserRound,
		Joystick,
		Coins
	} from 'lucide-svelte';
	import { logout } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import { UserStore } from '$lib/stores/user.store.svelte';

	function isActive(path: string) {
		if (path === '/dashboard' && page.url.pathname !== '/dashboard') return false;
		return page.url.pathname.startsWith(path);
	}

	function handleLogout() {
		logout();
		UserStore.clear();
		goto('/signin');
	}
</script>

<aside
	class="bg-hunt-dark-400/20 border-hunt-light-900/10 fixed top-0 left-0 z-40 flex h-screen w-64 flex-col border-r px-4"
>
	<div class="border-hunt-light-300/5 flex items-center gap-3 border-b py-6">
		<div
			class="bg-hunt-dark-500 ring-hunt-purple-400 relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full ring-2"
		>
			{#if UserStore.isLoading}
				<div class="bg-hunt-dark-500 absolute inset-0 flex items-center justify-center">
					<div
						class="border-hunt-purple-500 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"
					></div>
				</div>
			{:else if UserStore.data?.avatar}
				<img src={UserStore.data.avatar} alt="User Avatar" class="h-full w-full object-cover" />
			{:else if UserStore.data?.username}
				<span class="text-hunt-light-300 text-lg font-bold">
					{UserStore.data.username[0].toUpperCase()}
				</span>
			{:else}
				<CircleUserRound class="text-hunt-light-700" />
			{/if}
		</div>

		<div class="flex flex-col gap-0.5 overflow-hidden">
			{#if UserStore.isLoading && !UserStore.data}
				<div class="bg-hunt-light-900/10 h-4 w-24 animate-pulse rounded"></div>
				<div class="bg-hunt-light-900/10 mt-1 h-3 w-32 animate-pulse rounded"></div>
			{:else if UserStore.data}
				<h3 class="text-hunt-light-300 truncate text-sm font-bold">
					{UserStore.data.username}
				</h3>
				<p class="text-hunt-light-700 truncate text-xs font-semibold" title={UserStore.data.email}>
					{UserStore.data.email}
				</p>
			{:else}
				<div class="bg-hunt-light-900/10 h-4 w-20 rounded opacity-20"></div>
			{/if}
		</div>
	</div>

	<nav class="flex-1 space-y-2 py-6">
		<a
			href="/dashboard"
			class="group text-md flex items-center gap-3 rounded-md px-3 py-2.5 font-bold transition-colors
      {page.url.pathname === '/dashboard'
				? 'bg-hunt-purple-500 text-hunt-light-300'
				: 'text-hunt-light-600 hover:text-hunt-light-300 hover:bg-hunt-dark-300/15'}
      "
		>
			<LayoutDashboard size={24} strokeWidth={2.5} />
			Painel
		</a>
		<a
			href="/dashboard/slots"
			class="group text-md flex items-center gap-3 rounded-md px-3 py-2.5 font-bold transition-colors
    {isActive('/dashboard/slots')
				? 'bg-hunt-purple-500 text-hunt-light-300'
				: 'text-hunt-light-600 hover:text-hunt-light-300 hover:bg-hunt-dark-300/15'}"
		>
			<Coins size={24} strokeWidth={2.5} />
			Slots
		</a>
		<a
			href="/dashboard/providers"
			class="group text-md flex items-center gap-3 rounded-md px-3 py-2.5 font-bold transition-colors
    {isActive('/dashboard/providers')
				? 'bg-hunt-purple-500 text-hunt-light-300'
				: 'text-hunt-light-600 hover:text-hunt-light-300 hover:bg-hunt-dark-300/15'}"
		>
			<Joystick size={24} strokeWidth={2.5} />
			Provedoras
		</a>
		<a
			href="/dashboard/profile"
			class="group text-md flex items-center gap-3 rounded-md px-3 py-2.5 font-bold transition-colors
  {isActive('/dashboard/profile')
				? 'bg-hunt-purple-500 text-hunt-light-300'
				: 'text-hunt-light-600 hover:text-hunt-light-300 hover:bg-hunt-dark-300/15'}"
		>
			<CircleUserRound size={24} strokeWidth={2.5} />
			Perfil
		</a>
		<a
			href="/dashboard/settings"
			class="group text-md flex items-center gap-3 rounded-md px-3 py-2.5 font-bold transition-colors
      {isActive('/dashboard/settings')
				? 'bg-hunt-purple-500 text-hunt-light-300'
				: 'text-hunt-light-600 hover:text-hunt-light-300 hover:bg-hunt-dark-300/15'}
      "
		>
			<Settings size={24} strokeWidth={2.5} />
			Configurações
		</a>
	</nav>

	<div class="border-hunt-light-300/5 border-t py-6">
		<button
			onclick={handleLogout}
			class="text-md text-hunt-red-200 hover:bg-hunt-red-300/10 flex w-full items-center gap-3 rounded-md px-3 py-2.5 font-bold transition-colors"
		>
			<LogOut size={24} strokeWidth={2.5} />
			Sair
		</button>
	</div>
</aside>
