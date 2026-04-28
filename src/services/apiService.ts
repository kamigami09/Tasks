import { Task } from '../types';

export const BACKEND_URL = 'http://localhost:3000/api';

export const getAuthHeaders = () => {
    const token = localStorage.getItem('task_auth_token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

export const apiService = {
    fetchTasks: async (): Promise<Task[]> => {
        const res = await fetch(`${BACKEND_URL}/tasks`, { headers: getAuthHeaders() });
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
    },

    createTask: async (task: Partial<Task>): Promise<Task> => {
        const res = await fetch(`${BACKEND_URL}/tasks`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(task)
        });
        return res.json();
    },

    updateTask: async (id: string, updates: Partial<Task>): Promise<Task> => {
        const res = await fetch(`${BACKEND_URL}/tasks/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(updates)
        });
        return res.json();
    },

    deleteTask: async (id: string): Promise<void> => {
        await fetch(`${BACKEND_URL}/tasks/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
    }
};
