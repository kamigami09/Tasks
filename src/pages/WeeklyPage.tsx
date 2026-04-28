import { useState } from 'react';
import { useTaskStore } from '../store/useTaskStore';
import { TaskCard } from '../components/TaskCard';
import { TaskForm } from '../components/TaskForm';
import { Plus } from 'lucide-react';
import { getISOWeek, getYear } from 'date-fns';

export const WeeklyPage = () => {
    const [showForm, setShowForm] = useState(false);
    const tasks = useTaskStore(state => state.tasks);

    const today = new Date();
    const currentWeekId = `${getYear(today)}-W${getISOWeek(today)}`;

    const weeklyTasks = tasks.filter(t => t.level === 'weekly' && t.weekId === currentWeekId);
    const sortedTasks = [...weeklyTasks].sort((a, b) => {
        if (a.status === 'completed' && b.status !== 'completed') return 1;
        if (a.status !== 'completed' && b.status === 'completed') return -1;
        return 0;
    });

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
            <div className="flex justify-between items-end border-b dark:border-slate-800 pb-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Weekly Goals
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 capitalize font-medium text-brand-600 dark:text-brand-400">
                        {currentWeekId.replace('-', ' ')}
                    </p>
                </div>
                <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
                    <Plus size={18} /> <span className="hidden sm:inline">Add Weekly Task</span>
                </button>
            </div>

            {showForm && (
                <TaskForm
                    level="weekly"
                    defaultWeek={currentWeekId}
                    onSuccess={() => setShowForm(false)}
                    onCancel={() => setShowForm(false)}
                />
            )}

            {sortedTasks.length === 0 && !showForm ? (
                <div className="text-center py-24 text-slate-500 glass-card rounded-2xl border-dashed">
                    <div className="w-16 h-16 bg-brand-50 dark:bg-brand-500/10 text-brand-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Plus size={32} />
                    </div>
                    <h3 className="text-lg font-medium dark:text-slate-300">Your week is empty</h3>
                    <p className="mt-1">Add high-level goals you want to accomplish by Sunday.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {sortedTasks.map(task => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </div>
            )}
        </div>
    );
};
