import { writable } from 'svelte/store';
import { browser } from '$app/environment';

interface AuthState {
	token: string | null;
	isAuthenticated: boolean;
}

const initialToken = browser ? localStorage.getItem('token') : null;

const initialState: AuthState = {
	token: initialToken,
	isAuthenticated: !!initialToken
};

export const auth = writable<AuthState>(initialState);

export const login = (token: string) => {
	if (browser) {
		localStorage.setItem('token', token);
	}

	auth.set({
		token,
		isAuthenticated: true
	});
};

export const logout = () => {
	if (browser) {
		localStorage.removeItem('token');
	}

	auth.set({
		token: null,
		isAuthenticated: false
	});
};
