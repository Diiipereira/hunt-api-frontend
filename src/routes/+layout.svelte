<script lang="ts">
	import '../app.css';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { authState } from '$lib/stores/auth.svelte';
	import { browser } from '$app/environment';
	import ToastContainer from '$lib/components/ToastContainer.svelte';
	import { onMount } from 'svelte';
	import { UserStore } from '$lib/stores/user.store.svelte';

	let { children } = $props();

	onMount(() => {
		UserStore.loadFromCache();

		if (localStorage.getItem('token')) {
			UserStore.fetchUser();
		}
	});

	$effect(() => {
		if (browser) {
			const isAuthenticated = authState.isAuthenticated;
			const currentPath = page.url.pathname;
			const publicRoutes = ['/signin', '/signup', '/forgot-password', '/reset-password'];

			const isPublicRoute = publicRoutes.includes(currentPath);

			if (!isPublicRoute && !isAuthenticated) {
				goto('/signin');
				return;
			}

			if (isPublicRoute && isAuthenticated) {
				goto('/dashboard');
			}
		}
	});
</script>

<ToastContainer />

<main>
	{@render children()}
</main>
