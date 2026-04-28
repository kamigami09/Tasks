export type TaskLevel = 'monthly' | 'weekly' | 'daily';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'overdue';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
    id: string;
    title: string;
    description?: string;
    level: TaskLevel;
    status: TaskStatus;
    priority: TaskPriority;
    category?: string;
    dueDate?: string;         // ISO date (for monthly)
    scheduledDate?: string;   // ISO date (for daily)
    weekId?: string;          // Identifier for weekly tasks (e.g., '2026-W17')
    monthId?: string;         // Identifier for monthly tasks (e.g., '2026-04')
    parentTaskId?: string;    // Links Weekly to Monthly, or Daily to Weekly
    createdAt: string;
    updatedAt: string;
    completedAt?: string;
    estimatedMinutes?: number;
    notes?: string;
}
