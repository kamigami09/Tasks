import { create } from 'zustand';
import { Task } from '../types';
import { storageService } from '../services/storageService';
import { taskEngine } from '../engine/taskEngine';

interface TaskState {
    tasks: Task[];
    initialize: () => void;
    addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
    updateTask: (id: string, updates: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    completeTask: (id: string) => void;
    rescheduleTask: (id: string, newDate: string) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
    tasks: [],

    initialize: () => {
        const loaded = storageService.loadTasks();
        const synced = taskEngine.syncState(loaded, new Date().toISOString());
        set({ tasks: synced });

        // Only write to localStorage if syncState structurally modified the data
        if (loaded !== synced) {
            storageService.saveTasks(synced);
        }
    },

    addTask: (taskData) => {
        const now = new Date().toISOString();
        const newTask: Task = {
            ...taskData,
            id: crypto.randomUUID(),
            createdAt: now,
            updatedAt: now,
        };

        set((state) => {
            let nextTasks = [...state.tasks, newTask];
            nextTasks = taskEngine.syncState(nextTasks, now);
            return { tasks: nextTasks };
        });
    },

    updateTask: (id, updates) => {
        const now = new Date().toISOString();
        set((state) => {
            let nextTasks = state.tasks.map(t =>
                t.id === id ? { ...t, ...updates, updatedAt: now } : t
            );
            nextTasks = taskEngine.syncState(nextTasks, now);
            return { tasks: nextTasks };
        });
    },

    deleteTask: (id) => {
        const now = new Date().toISOString();
        set((state) => {
            let nextTasks = state.tasks.filter(t => t.id !== id);
            nextTasks = taskEngine.syncState(nextTasks, now);
            return { tasks: nextTasks };
        });
    },

    completeTask: (id) => {
        const now = new Date().toISOString();
        set((state) => {
            let nextTasks = state.tasks.map(t =>
                t.id === id ? { ...t, status: 'completed' as const, completedAt: now, updatedAt: now } : t
            );
            nextTasks = taskEngine.syncState(nextTasks, now);
            return { tasks: nextTasks };
        });
    },

    rescheduleTask: (id, newDate) => {
        const now = new Date().toISOString();
        set((state) => {
            let nextTasks = state.tasks.map(t => {
                if (t.id === id) {
                    return {
                        ...t,
                        scheduledDate: newDate,
                        // If it was overdue, and we reschedule, reset to pending
                        status: t.status === 'overdue' ? 'pending' : t.status,
                        updatedAt: now
                    };
                }
                return t;
            });
            nextTasks = taskEngine.syncState(nextTasks, now);
            return { tasks: nextTasks };
        });
    }
}));

// Use Zustand subscriber to automatically handle storage synchronization purely based on task reference changes
useTaskStore.subscribe((state, prevState) => {
    if (state.tasks !== prevState.tasks) {
        storageService.saveTasks(state.tasks);
    }
});
