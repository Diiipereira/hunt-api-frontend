import { PUBLIC_API_URL } from '$env/static/public';
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
		const token = localStorage.getItem('token');

		if (!token) {
			this.clear();
			return;
		}

		if (!user) {
			loading = true;
		}

		try {
			const response = await fetch(`${PUBLIC_API_URL}/users/me`, {
				headers: { Authorization: `Bearer ${token}` }
			});

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
			} else {
				if (response.status === 401) {
					this.clear();
				}
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
