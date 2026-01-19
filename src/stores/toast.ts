import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: string;
    type: ToastType;
    message: string;
    duration: number;
}

interface ToastState {
    toasts: Toast[];
    add: (type: ToastType, message: string, duration?: number) => void;
    remove: (id: string) => void;
    success: (msg: string, duration?: number) => void;
    error: (msg: string, duration?: number) => void;
    warning: (msg: string, duration?: number) => void;
    info: (msg: string, duration?: number) => void;
}

export const useToastStore = create<ToastState>((set, get) => ({
    toasts: [],

    add: (type, message, duration = 4000) => {
        const id = crypto.randomUUID();
        const newToast = { id, type, message, duration };
        set((state) => ({ toasts: [...state.toasts, newToast] }));

        if (duration > 0) {
            setTimeout(() => {
                get().remove(id);
            }, duration);
        }
    },

    remove: (id) =>
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

    success: (msg, duration) => get().add('success', msg, duration),
    error: (msg, duration) => get().add('error', msg, duration),
    warning: (msg, duration) => get().add('warning', msg, duration),
    info: (msg, duration) => get().add('info', msg, duration),
}));
