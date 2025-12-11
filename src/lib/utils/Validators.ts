export function validateEmail(v: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export function validatePassword(v: string) {
	return v.length >= 6;
}
