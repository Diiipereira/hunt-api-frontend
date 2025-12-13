import { api } from '$lib/services/api';
import type { PageLoad } from './$types';

export const ssr = false;

export const load: PageLoad = async () => {
	try {
		const response = await api('/users/me');

		if (!response.ok) {
			throw new Error('Falha ao carregar perfil');
		}

		const profile = await response.json();
		return { profile };
	} catch (error) {
		console.error(error);
		return { profile: null };
	}
};
