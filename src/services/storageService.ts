import { Task } from '../types';

const STORAGE_KEY = 'task_follow_data';

export const storageService = {
    loadTasks: (): Task[] => {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Failed to load tasks', e);
            return [];
        }
    },

    saveTasks: (tasks: Task[]): void => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        } catch (e) {
            console.error('Failed to save tasks', e);
        }
    },

    clear: (): void => {
        localStorage.removeItem(STORAGE_KEY);
    }
};
