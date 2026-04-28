import { Task } from '../types';

// Pure functions for Task manipulations

export const calculateProgress = (parentTaskId: string, allTasks: Task[]): number => {
    const children = allTasks.filter(t => t.parentTaskId === parentTaskId);
    if (children.length === 0) return 0;

    const completed = children.filter(t => t.status === 'completed').length;
    return Math.round((completed / children.length) * 100);
};

export const breakTaskIntoChildren = (
    parent: Task,
    childrenDefinitions: Pick<Task, 'title' | 'description' | 'scheduledDate' | 'weekId'>[]
): Task[] => {
    const now = new Date().toISOString();
    // Creates child tasks with references to parent
    return childrenDefinitions.map(def => ({
        id: crypto.randomUUID(),
        title: def.title,
        description: def.description,
        level: parent.level === 'monthly' ? 'weekly' : 'daily',
        status: 'pending',
        priority: parent.priority, // inherit priority default
        parentTaskId: parent.id,
        scheduledDate: def.scheduledDate,
        weekId: def.weekId,
        createdAt: now,
        updatedAt: now,
    }));
};

export const getTasksByLevel = (tasks: Task[], level: Task['level']): Task[] => {
    return tasks.filter(t => t.level === level);
};

export const getTasksByDate = (tasks: Task[], dateIsoString: string): Task[] => {
    // Simple YYYY-MM-DD string matching for daily tasks
    const prefix = dateIsoString.split('T')[0];
    return tasks.filter(t => t.level === 'daily' && t.scheduledDate?.startsWith(prefix));
};

export const getOverdueTasks = (tasks: Task[], currentDateIso: string): Task[] => {
    return tasks.filter(t => {
        if (t.status === 'completed') return false;
        if (t.level === 'daily' && t.scheduledDate) {
            // Overdue if scheduledDate is fully in the past compared to today (end of day comparison typically, but simplified here)
            return t.scheduledDate < currentDateIso.split('T')[0];
        }
        return false;
    });
};
