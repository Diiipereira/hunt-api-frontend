<script>
	import Sidebar from '$lib/components/Sidebar.svelte';
	let { children } = $props();
</script>

<div class="bg-hunt-dark-500 flex min-h-screen text-white">
	<Sidebar />

	<div class="ml-64 flex-1 p-8">
		{@render children()}
	</div>
</div>
