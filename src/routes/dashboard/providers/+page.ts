import { api } from '$lib/services/api';
import type { PageLoad } from './$types';

export const ssr = false;

export const load: PageLoad = async () => {
	try {
		const response = await api('/providers');

		if (!response.ok) {
			return { providers: [] };
		}

		const data = await response.json();

		const providers = Array.isArray(data) ? data : data.data || [];

		return { providers };
	} catch (error) {
		console.error('Erro ao carregar provedoras:', error);
		return { providers: [] };
	}
};
