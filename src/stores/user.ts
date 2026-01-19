import { create } from 'zustand';
import { api } from '../lib/api';

interface User {
    id: string;
    username: string;
    email: string;
    avatar?: string;
}

interface UserState {
    user: User | null;
    loading: boolean;
    fetchUser: () => Promise<void>;
    updateLocal: (partialData: Partial<User>) => void;
    clear: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
    user: null,
    loading: false,

    fetchUser: async () => {
        const { user } = get();
        if (user) return; // Already loaded

        set({ loading: true });
        try {
            const response = await api.get('/users/me');
            if (response.status === 200) {
                const data = response.data;
                const userData: User = {
                    id: data.id,
                    username: data.username || data.userName,
                    email: data.email,
                    avatar: data.avatar,
                };
                set({ user: userData });
            }
        } catch {
            // Error handling if needed, currently silent
        } finally {
            set({ loading: false });
        }
    },

    updateLocal: (partialData) =>
        set((state) => ({
            user: state.user ? { ...state.user, ...partialData } : null,
        })),

    clear: () => set({ user: null }),
}));
