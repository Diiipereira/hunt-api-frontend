export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
	id: string;
	type: ToastType;
	message: string;
	duration: number;
}

const toasts = $state<Toast[]>([]);

export class ToastService {
	static get toasts() {
		return toasts;
	}

	static add(type: ToastType, message: string, duration = 4000) {
		const id = crypto.randomUUID();

		toasts.push({ id, type, message, duration });

		if (duration > 0) {
			setTimeout(() => {
				this.remove(id);
			}, duration);
		}
	}

	static remove(id: string) {
		const index = toasts.findIndex((t) => t.id === id);
		if (index > -1) {
			toasts.splice(index, 1);
		}
	}

	static success(msg: string, duration?: number) {
		this.add('success', msg, duration);
	}
	static error(msg: string, duration?: number) {
		this.add('error', msg, duration);
	}
	static warning(msg: string, duration?: number) {
		this.add('warning', msg, duration);
	}
	static info(msg: string, duration?: number) {
		this.add('info', msg, duration);
	}
}
