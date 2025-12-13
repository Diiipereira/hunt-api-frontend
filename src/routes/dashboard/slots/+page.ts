import { api } from '$lib/services/api';
import type { PageLoad } from './$types';

export const ssr = false;

export const load: PageLoad = async () => {
	try {
		const response = await api('/slots');

		if (!response.ok) {
			return { slots: [] };
		}

		const data = await response.json();
		const slots = Array.isArray(data) ? data : data.data || [];

		return { slots };
	} catch (error) {
		console.error('Erro ao carregar slots:', error);
		return { slots: [] };
	}
};
