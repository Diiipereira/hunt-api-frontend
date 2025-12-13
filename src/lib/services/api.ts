import { PUBLIC_API_URL } from '$env/static/public';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';

interface FetchOptions extends RequestInit {
	params?: Record<string, string>;
}

export async function api(endpoint: string, options: FetchOptions = {}) {
	if (!browser) return new Response(null, { status: 404 });

	const token = localStorage.getItem('token');
	const requestHeaders: Record<string, string> = {};

	if (!(options.body instanceof FormData)) {
		requestHeaders['Content-Type'] = 'application/json';
	}

	if (token) {
		requestHeaders['Authorization'] = `Bearer ${token}`;
	}

	if (options.headers) {
		const customHeaders = options.headers as Record<string, string>;
		Object.assign(requestHeaders, customHeaders);
	}

	let url = `${PUBLIC_API_URL}${endpoint}`;

	if (options.params) {
		const searchParams = new URLSearchParams(options.params);
		url += `?${searchParams.toString()}`;
	}

	const response = await fetch(url, { ...options, headers: requestHeaders });

	if (response.status === 401) {
		localStorage.removeItem('token');
		goto('/signin');
	}

	return response;
}
