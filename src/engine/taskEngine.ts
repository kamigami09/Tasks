import { Task } from '../types';
import { calculateProgress } from '../utils/taskLogic';

export const taskEngine = {
    syncState: (tasks: Task[], currentDateIso: string): Task[] => {
        let modified = false;
        const currentPrefix = currentDateIso.split('T')[0];

        // Shallow clone array to safely mutate references within
        let nextTasks = [...tasks];

        // Pass 1: Overdue detection
        for (let i = 0; i < nextTasks.length; i++) {
            const task = nextTasks[i];
            if (
                (task.status === 'pending' || task.status === 'in_progress') &&
                task.level === 'daily' &&
                task.scheduledDate &&
                task.scheduledDate < currentPrefix
            ) {
                nextTasks[i] = {
                    ...task,
                    status: 'overdue',
                    updatedAt: currentDateIso
                };
                modified = true;

                // Trigger native browser notification
                if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
                    new Notification('Task Overdue', {
                        body: `Your task "${task.title}" is now overdue!`,
                        icon: '/vite.svg'
                    });
                }
            }
        }

        // Pass 2: Sync Parents progress to Auto-complete
        const parentsWithChildren = new Set(nextTasks.filter(t => t.parentTaskId).map(t => t.parentTaskId));

        parentsWithChildren.forEach(parentId => {
            const parentIndex = nextTasks.findIndex(t => t.id === parentId);
            if (parentIndex !== -1) {
                const parent = nextTasks[parentIndex];
                if (parent.status !== 'completed') {
                    const progress = calculateProgress(parentId as string, nextTasks);
                    if (progress === 100) {
                        nextTasks[parentIndex] = {
                            ...parent,
                            status: 'completed',
                            completedAt: currentDateIso,
                            updatedAt: currentDateIso
                        };
                        modified = true;
                    }
                }
            }
        });

        // If completely unmodified, return original array to preserve React referential equality
        return modified ? nextTasks : tasks;
    }
};
