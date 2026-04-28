import { useState } from 'react';
import { TaskLevel, TaskPriority } from '../types';
import { useTaskStore } from '../store/useTaskStore';

interface TaskFormProps {
    level: TaskLevel;
    parentTaskId?: string;
    defaultDate?: string;
    defaultWeek?: string;
    defaultMonth?: string;
    onSuccess: () => void;
    onCancel: () => void;
}

export const TaskForm = ({ level, parentTaskId, defaultDate, defaultWeek, defaultMonth, onSuccess, onCancel }: TaskFormProps) => {
    const addTask = useTaskStore(state => state.addTask);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<TaskPriority>('medium');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        addTask({
            title,
            description,
            priority,
            level,
            status: 'pending',
            parentTaskId,
            scheduledDate: defaultDate,
            weekId: defaultWeek,
            monthId: defaultMonth
        });

        onSuccess();
    };

    return (
        <form onSubmit={handleSubmit} className="glass-card p-4 rounded-xl shadow-sm animate-slide-up">
            <div className="space-y-4">
                <div>
                    <input
                        type="text"
                        placeholder="Task Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="input-field font-medium text-lg placeholder:font-normal"
                        autoFocus
                        required
                    />
                </div>
                <div>
                    <textarea
                        placeholder="Notes (optional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="input-field text-sm min-h-[80px]"
                    />
                </div>

                <div className="flex items-center justify-between pt-2">
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as TaskPriority)}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm dark:text-white"
                    >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium</option>
                        <option value="high">High Priority</option>
                    </select>

                    <div className="space-x-2">
                        <button type="button" onClick={onCancel} className="btn-secondary text-sm py-1.5 px-3">
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary text-sm py-1.5 px-4" disabled={!title.trim()}>
                            Save Task
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};
