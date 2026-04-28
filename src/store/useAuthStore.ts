import { create } from 'zustand';

interface AuthState {
    token: string | null;
    user: any | null;
    login: (token: string, user: any) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    token: localStorage.getItem('task_auth_token') || null,
    user: JSON.parse(localStorage.getItem('task_auth_user') || 'null'),

    login: (token, user) => {
        localStorage.setItem('task_auth_token', token);
        localStorage.setItem('task_auth_user', JSON.stringify(user));
        set({ token, user });
    },

    logout: () => {
        localStorage.removeItem('task_auth_token');
        localStorage.removeItem('task_auth_user');
        set({ token: null, user: null });
    }
}));
