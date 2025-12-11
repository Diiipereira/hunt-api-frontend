<script lang="ts">
	import { LayoutDashboard } from 'lucide-svelte';
</script>

<div
	class="bg-hunt-dark-500 relative flex h-screen w-full flex-col items-center justify-center overflow-hidden px-4 text-center"
>
	<div class="animate-fade-in mb-10 w-full max-w-md">
		<svg
			viewBox="240 90 420 240"
			xmlns="http://www.w3.org/2000/svg"
			class="h-auto w-full drop-shadow-2xl"
		>
			<rect
				x="250"
				y="100"
				width="400"
				height="220"
				rx="14"
				fill="rgba(168, 85, 247, 0.05)"
				stroke="#9d00ff"
				stroke-width="6"
			/>

			<rect x="250" y="288" width="400" height="30" rx="6" fill="#9d00ff" opacity="0.3" />

			<text
				x="450"
				y="255"
				text-anchor="middle"
				font-family="Spline Sans"
				font-size="150"
				font-weight="900"
				fill="#9d00ff"
			>
				404
			</text>

			<text
				x="450"
				y="310"
				text-anchor="middle"
				font-family="Spline Sans"
				font-size="16"
				fill="#c4c4c4"
				font-weight="800"
				letter-spacing="2"
			>
				PÁGINA NÃO ENCONTRADA
			</text>
		</svg>
	</div>

	<div class="mt-8 max-w-sm space-y-4">
		<p class="text-hunt-light-600 text-lg leading-relaxed">
			Oops! Parece que você se aventurou em território desconhecido. A página que você procura não
			existe ou foi movida.
		</p>
	</div>

	<div class="mt-8">
		<a
			href="/dashboard"
			class="bg-hunt-purple-500 hover:bg-hunt-purple-300 shadow-hunt-purple-500/20 group text-hunt-light-300 border-hunt-purple-200 flex min-w-[220px] items-center justify-center gap-2 rounded-md border px-6 py-3 text-sm font-bold transition-all hover:-translate-y-0.5 hover:shadow-lg"
		>
			Voltar ao Dashboard
		</a>
	</div>
</div>
