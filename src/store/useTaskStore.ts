import { create } from 'zustand';
import { Task } from '../types';
import { apiService } from '../services/apiService';
import { taskEngine } from '../engine/taskEngine';

interface TaskState {
    tasks: Task[];
    kimiApiKey: string;
    initialize: () => Promise<void>;
    setKimiApiKey: (key: string) => void;
    addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => Promise<void>;
    updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    completeTask: (id: string) => Promise<void>;
    rescheduleTask: (id: string, newDate: string) => Promise<void>;
    reorderTasks: (activeId: string, overId: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
    tasks: [],
    kimiApiKey: localStorage.getItem('task_kimi_api_key') || '',

    initialize: async () => {
        try {
            const loaded = await apiService.fetchTasks();
            const synced = taskEngine.syncState(loaded, new Date().toISOString());
            set({ tasks: synced });

            // Sync engine triggers mutations for overdue locally, but not permanently unless triggered via updates.
            // In a full prod app we would batch update these to the backend if syncing mutated them.
        } catch (e) {
            console.error("Failed to load cloud tasks");
        }
    },

    setKimiApiKey: (key) => {
        localStorage.setItem('task_kimi_api_key', key);
        set({ kimiApiKey: key });
    },

    addTask: async (taskData) => {
        try {
            const created = await apiService.createTask(taskData);
            set((state) => ({ tasks: [...state.tasks, created] }));
        } catch (e) {
            console.error("Failed to create task", e);
        }
    },

    updateTask: async (id, updates) => {
        try {
            const updated = await apiService.updateTask(id, updates);
            set((state) => ({
                tasks: state.tasks.map(t => t.id === id ? { ...t, ...updated } : t)
            }));
        } catch (e) {
            console.error("Failed to update task", e);
        }
    },

    deleteTask: async (id) => {
        try {
            await apiService.deleteTask(id);
            set((state) => ({ tasks: state.tasks.filter(t => t.id !== id) }));
        } catch (e) {
            console.error("Failed to delete task", e);
        }
    },

    completeTask: async (id) => {
        const store = get();
        await store.updateTask(id, { status: 'completed' });
    },

    rescheduleTask: async (id, newDate) => {
        const store = get();
        await store.updateTask(id, { scheduledDate: newDate, status: 'pending' });
    },

    reorderTasks: async (activeId, overId) => {
        set((state) => {
            const activeIndex = state.tasks.findIndex(t => t.id === activeId);
            const overIndex = state.tasks.findIndex(t => t.id === overId);
            if (activeIndex === -1 || overIndex === -1) return state;

            const newTasks = [...state.tasks];
            const [moved] = newTasks.splice(activeIndex, 1);
            newTasks.splice(overIndex, 0, moved);

            // Re-assign basic order indices locally
            const updatedTasks = newTasks.map((t, index) => ({ ...t, orderIndex: index }));

            // Fire async without breaking UI thread
            apiService.updateTask(activeId, { orderIndex: overIndex });

            return { tasks: updatedTasks };
        });
    }
}));
