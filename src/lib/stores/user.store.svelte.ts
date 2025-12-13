import { api } from '$lib/services/api';
import { browser } from '$app/environment';

interface User {
	id: string;
	username: string;
	email: string;
	avatar?: string;
}

let user = $state<User | null>(null);
let loading = $state(false);

export class UserStore {
	static get data() {
		return user;
	}
	static get isLoading() {
		return loading;
	}

	static loadFromCache() {
		if (browser) {
			const cached = localStorage.getItem('user_cache');
			if (cached) {
				try {
					user = JSON.parse(cached);
				} catch {
					localStorage.removeItem('user_cache');
				}
			}
		}
	}

	static async fetchUser() {
		if (!browser) return;

		if (!localStorage.getItem('token')) {
			this.clear();
			return;
		}

		if (!user) {
			loading = true;
		}

		try {
			const response = await api('/users/me');

			if (response.ok) {
				const data = await response.json();

				const userData: User = {
					id: data.id,
					username: data.username || data.userName,
					email: data.email,
					avatar: data.avatar
				};

				user = userData;
				localStorage.setItem('user_cache', JSON.stringify(userData));
			}
		} catch (error) {
			console.error('Erro ao buscar usuário:', error);
		} finally {
			loading = false;
		}
	}

	static updateLocal(partialData: Partial<User>) {
		if (user) {
			user = { ...user, ...partialData };
			if (browser) {
				localStorage.setItem('user_cache', JSON.stringify(user));
			}
		}
	}

	static clear() {
		user = null;
		if (browser) {
			localStorage.removeItem('token');
			localStorage.removeItem('user_cache');
		}
	}
}
