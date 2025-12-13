<script lang="ts">
	import { CircleUserRound, Camera, LoaderCircle, Upload } from 'lucide-svelte';
	import { api } from '$lib/services/api';
	import AvatarCropper from '$lib/components/AvatarCropper.svelte';
	import ValidateInput from '$lib/components/forms/Input.svelte';
	import { ToastService } from '$lib/stores/toast.svelte';
	import { ProfileService } from '$lib/services/profile.service';
	import { UserStore } from '$lib/stores/user.store.svelte';

	let { data } = $props();

	let userProfile = data.profile || {};

	let username = $state(userProfile.username || userProfile.userName || '');
	let email = $state(userProfile.email || '');
	let userId = $state(userProfile.id || '');

	let apiAvatar = userProfile.avatar || '';
	let storeAvatar = UserStore.data?.avatar || '';
	let avatarUrl = $state(storeAvatar.split('?')[0] === apiAvatar ? storeAvatar : apiAvatar);

	let currentPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');

	let errors = $state({
		current: '',
		new: '',
		confirm: ''
	});

	let isSaving = $state(false);
	let showCropper = $state(false);
	let selectedImageSrc = $state<string | null>(null);
	let fileInputRef = $state<HTMLInputElement | null>(null);
	let isUploading = $state(false);

	const validateRequired = (v: string) => v.length > 0;
	const validateLength = (v: string) => v.length >= 6;
	const validateMatch = (v: string) => v === newPassword;

	function triggerFileInput() {
		fileInputRef?.click();
	}

	function handleFileSelect(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];

		if (!file) return;

		if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
			ToastService.warning('Apenas imagens JPEG, JPG ou PNG são permitidas.');
			return;
		}
		if (file.size > 3 * 1024 * 1024) {
			ToastService.warning('A imagem deve ter no máximo 3MB.');
			return;
		}

		const reader = new FileReader();
		reader.onload = () => {
			selectedImageSrc = reader.result as string;
			showCropper = true;
		};
		reader.readAsDataURL(file);
		target.value = '';
	}

	async function handleAvatarUpload(blob: Blob) {
		showCropper = false;
		isUploading = true;

		try {
			const formData = new FormData();
			formData.append('avatar', blob, 'avatar.jpg');

			await new Promise((resolve) => setTimeout(resolve, 1000));

			const response = await api('/users/me/avatar', {
				method: 'PATCH',
				body: formData
			});

			if (!response.ok) throw new Error('Falha no upload');
			const data = await response.json();

			if (data.avatar) {
				const newAvatarUrl = `${data.avatar}?t=${new Date().getTime()}`;
				avatarUrl = newAvatarUrl;
				UserStore.updateLocal({ avatar: newAvatarUrl });
			}

			ToastService.success('Sua foto de perfil foi atualizada');
		} catch (error) {
			console.error('Erro ao atualizar avatar:', error);
			ToastService.error('Erro ao atualizar foto de perfil.');
		} finally {
			isUploading = false;
			selectedImageSrc = null;
		}
	}

	function handleCancelCrop() {
		showCropper = false;
		selectedImageSrc = null;
		if (fileInputRef) fileInputRef.value = '';
	}

	async function handleSave() {
		const error = ProfileService.validatePasswordChange({
			current: currentPassword,
			newPass: newPassword,
			confirm: confirmPassword
		});
		if (error) {
			ToastService.warning(error);
			return;
		}

		isSaving = true;

		try {
			await ProfileService.updatePassword(currentPassword, newPassword);
			ToastService.success('Sua senha foi alterada com sucesso!');

			currentPassword = '';
			newPassword = '';
			confirmPassword = '';
			errors.current = '';
			errors.new = '';
			errors.confirm = '';
		} catch (error: any) {
			console.error(error);
			ToastService.error(error.message || 'Erro ao atualizar senha');
		} finally {
			isSaving = false;
		}
	}

	function handleCancel() {
		currentPassword = '';
		newPassword = '';
		confirmPassword = '';
		ToastService.info('Alterações canceladas');
	}
</script>

{#if showCropper && selectedImageSrc}
	<AvatarCropper
		imageSrc={selectedImageSrc}
		onCancel={handleCancelCrop}
		onConfirm={handleAvatarUpload}
	/>
{/if}

<div class="relative mx-auto max-w-7xl">
	{#if isUploading}
		<div
			class="bg-hunt-dark-500/50 absolute inset-0 z-50 flex h-full items-center justify-center rounded-xl backdrop-blur-sm transition-all"
		>
			<div class=" flex flex-col items-center gap-3">
				<LoaderCircle class="text-hunt-purple-500 h-10 w-10 animate-spin" />
				<div class="text-hunt-light-300 animate-pulse font-bold">Atualizando foto...</div>
			</div>
		</div>
	{/if}

	<div
		class="bg-hunt-dark-400/20 border-hunt-purple-200/20 my-8 h-24 rounded-xl border-b border-solid p-6 shadow-lg"
	>
		<div class="mb-8 flex items-center justify-between">
			<div class="flex items-center gap-3">
				<div class="bg-hunt-purple-500 rounded-full p-2">
					<CircleUserRound class="text-hunt-purple" size={30} />
				</div>
				<h1 class="text-hunt-light-300 text-2xl font-extrabold">Olá, {username}</h1>
			</div>
			<a
				href="/dashboard"
				class="bg-hunt-dark-500 border-hunt-light-900/10 text-hunt-light-500 hover:bg-hunt-light-600/5 hover:text-hunt-light-300 flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-bold transition-colors"
			>
				Minhas Caçadas
			</a>
		</div>
	</div>

	<div class="bg-hunt-dark-400/20 border-hunt-purple-300/10 rounded-xl border p-8 shadow-xl">
		<div
			class="border-hunt-light-300/5 mb-8 flex flex-col items-center gap-8 border-b pb-8 sm:flex-row sm:items-start"
		>
			<div class="flex flex-col items-center gap-4">
				<div class="group relative">
					<button
						type="button"
						class="border-hunt-purple-500 bg-hunt-light-900/10 relative flex h-32 w-32 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 transition-transform active:scale-95"
						onclick={triggerFileInput}
						aria-label="Alterar foto de perfil"
					>
						{#if avatarUrl}
							<img src={avatarUrl} alt="Avatar" class="h-full w-full object-cover" />
						{:else}
							<span class="text-hunt-light-700 text-4xl font-bold select-none">
								{username && username[0] ? username[0].toUpperCase() : '?'}
							</span>
						{/if}

						<div
							class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
						>
							<Camera class="text-white drop-shadow-md" size={32} />
						</div>
					</button>

					<div
						class="bg-hunt-purple-400 pointer-events-none absolute -top-11 left-1/2 z-20 -translate-x-1/2 rounded-md px-3 py-2 text-xs font-bold whitespace-nowrap text-white opacity-0 shadow-lg transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100"
					>
						{avatarUrl ? 'Alterar Foto' : 'Adicionar Imagem'}
						<div
							class="border-t-hunt-purple-400 absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent"
						></div>
					</div>
				</div>

				<input
					bind:this={fileInputRef}
					type="file"
					accept="image/png, image/jpeg, image/jpg"
					onchange={handleFileSelect}
					class="hidden"
				/>

				<button
					onclick={triggerFileInput}
					class="text-hunt-purple-300 hover:text-hunt-purple-200 bg-hunt-purple-500/10 hover:bg-hunt-purple-500/20 border-hunt-purple-500/20 flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition-colors"
				>
					<Upload size={14} />
					{avatarUrl ? 'Trocar Foto' : 'Carregar Foto'}
				</button>
			</div>

			<div class="flex flex-col gap-2 pt-2 text-center sm:text-left">
				<h3 class="text-hunt-light-300 text-3xl font-bold">{username}</h3>
				<p class="text-hunt-light-600 text-md font-semibold">{email}</p>
				<div
					class="bg-hunt-dark-500 border-hunt-light-900/10 mt-2 inline-flex items-center gap-2 rounded-md border px-3 py-1.5"
				>
					<p class="text-hunt-light-900 text-xs font-semibold">
						Formatos: JPEG, JPG, PNG (Máx. 3MB)
					</p>
				</div>
			</div>
		</div>

		<form
			onsubmit={(e) => {
				e.preventDefault();
				handleSave();
			}}
			class="space-y-6"
		>
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div class="group relative">
					<ValidateInput label="Usuário" name="username" value={username} disabled={true} />
					<div
						class="bg-hunt-purple-400 text-hunt-light-300 pointer-events-none absolute -top-10 left-1/2 z-20 -translate-x-[50%] rounded-md px-3 py-2 text-xs font-bold whitespace-nowrap opacity-0 shadow-lg transition-all duration-500 ease-out group-hover:translate-y-2 group-hover:opacity-100"
					>
						Este campo não pode ser alterado
						<div
							class="border-t-hunt-purple-400 absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent"
						></div>
					</div>
				</div>

				<div class="group relative">
					<ValidateInput label="Endereço de E-mail" name="email" value={email} disabled={true} />
					<div
						class="bg-hunt-purple-400 text-hunt-light-300 pointer-events-none absolute -top-10 left-1/2 z-20 -translate-x-[50%] rounded-md px-3 py-2 text-xs font-bold whitespace-nowrap opacity-0 shadow-lg transition-all duration-500 ease-out group-hover:translate-y-2 group-hover:opacity-100"
					>
						Este campo não pode ser alterado
						<div
							class="border-t-hunt-purple-400 absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent"
						></div>
					</div>
				</div>
			</div>

			<div class="space-y-2">
				<ValidateInput
					label="Senha Atual"
					name="current-password"
					type="password"
					placeholder="Digite a senha atual"
					bind:value={currentPassword}
					bind:error={errors.current}
					validate={validateRequired}
					errorMessage="Campo obrigatório"
				/>
			</div>

			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<ValidateInput
					label="Nova Senha"
					name="new-password"
					type="password"
					placeholder="Mínimo 6 caracteres"
					bind:value={newPassword}
					bind:error={errors.new}
					validate={validateLength}
					errorMessage="Mínimo 6 caracteres"
				/>

				<ValidateInput
					label="Confirmar nova senha"
					name="confirm-password"
					type="password"
					placeholder="Repita a senha"
					bind:value={confirmPassword}
					bind:error={errors.confirm}
					validate={validateMatch}
					errorMessage="As senhas não coincidem"
				/>
			</div>

			<div class="flex justify-end gap-4 pt-6">
				<button
					type="button"
					onclick={handleCancel}
					class="border-hunt-light-900/10 text-hunt-light-500 hover:bg-hunt-light-600/5 bg-hunt-dark-500 hover:text-hunt-light-300 cursor-pointer rounded-md border px-6 py-2.5 text-sm font-bold transition-colors"
				>
					Cancelar
				</button>

				<button
					type="submit"
					disabled={isSaving}
					class="bg-hunt-purple-500 border-hunt-purple-900/10 hover:bg-hunt-purple-300 shadow-hunt-purple-500/20 text-hunt-light-300 hover:text-hunt-light-500 flex cursor-pointer items-center gap-2 rounded-md px-6 py-2.5 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-70"
				>
					{#if isSaving}
						<LoaderCircle class="h-4 w-4 animate-spin" />
						Salvando...
					{:else}
						Salvar Alterações
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>
