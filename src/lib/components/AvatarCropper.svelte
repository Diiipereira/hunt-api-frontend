<script lang="ts">
	import Cropper from 'svelte-easy-crop';
	import { getCroppedImg } from '$lib/cropper/utils';

	let { imageSrc, onCancel, onConfirm } = $props<{
		imageSrc: string;
		onCancel: () => void;
		onConfirm: (blob: Blob) => void;
	}>();

	let crop = $state({ x: 0, y: 0 });
	let zoom = $state(1);
	let pixelCrop = $state<any>(null);
	let loading = $state(false);

	function onCropComplete(e: any) {
		if (e.detail && e.detail.pixels) {
			pixelCrop = e.detail.pixels;
		} else if (e.pixels) {
			pixelCrop = e.pixels;
		}
	}

	async function handleSave() {
		if (!pixelCrop || !imageSrc) {
			console.error('Dados de corte não encontrados');
			return;
		}

		loading = true;
		try {
			const croppedBlob = await getCroppedImg(imageSrc, pixelCrop);
			if (croppedBlob) {
				onConfirm(croppedBlob);
			}
		} catch (e) {
			console.error(e);
		} finally {
			loading = false;
		}
	}
</script>

<div
	class="bg-hunt-dark-500/90 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md"
>
	<div
		class="bg-hunt-dark border-hunt-purple-300/10 w-full max-w-md overflow-hidden rounded-xl border shadow-2xl"
	>
		<div class="border-hunt-light-300/10 border-b p-4">
			<h3 class="text-hunt-light-300 text-lg font-bold">Ajustar Imagem</h3>
		</div>

		<div class="bg-hunt-dark-400/20 relative h-100 w-full">
			<Cropper
				image={imageSrc}
				bind:crop
				bind:zoom
				aspect={1}
				showGrid={false}
				cropShape="round"
				oncropcomplete={onCropComplete}
			/>
		</div>

		<div class="px-6 py-4">
			<label class="block">
				<span class="text-hunt-light-600 mb-2 block text-xs font-medium">Zoom</span>
				<input
					type="range"
					min="1"
					max="3"
					step="0.1"
					bind:value={zoom}
					class="accent-hunt-purple bg-hunt-light-300/10 h-2 w-full appearance-none rounded-lg outline-none"
				/>
			</label>
		</div>

		<div class="border-hunt-light-300/10 bg-hunt-dark-400/10 flex justify-end gap-3 border-t p-4">
			<button
				onclick={onCancel}
				class="text-hunt-light-600 bg-hunt-dark-500 border-hunt-light-900/10 hover:bg-hunt-light-600/5 cursor-pointer rounded-md border px-4 py-2 text-sm font-bold transition-colors hover:text-white"
			>
				Cancelar
			</button>
			<button
				onclick={handleSave}
				disabled={loading}
				class="bg-hunt-purple-500 hover:bg-hunt-purple-300 text-hunt-light-300 cursor-pointer rounded-md px-4 py-2 text-sm font-bold shadow-lg transition-all disabled:opacity-50"
			>
				{loading ? 'Salvar Avatar' : 'Salvar Avatar'}
			</button>
		</div>
	</div>
</div>

<style>
	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 16px;
		height: 16px;
		background: #8b5cf6;
		border-radius: 50%;
		cursor: pointer;
	}
</style>
