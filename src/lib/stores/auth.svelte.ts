import { browser } from '$app/environment';

class AuthService {
	token = $state(browser ? localStorage.getItem('token') : null);

	isAuthenticated = $derived(!!this.token);

	login(token: string) {
		if (browser) {
			localStorage.setItem('token', token);
		}
		this.token = token;
	}

	logout() {
		if (browser) {
			localStorage.removeItem('token');
		}
		this.token = null;
	}
}

export const authState = new AuthService();
