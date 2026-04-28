import { CheckCircle2, Circle, Clock, Tag, Trash2 } from 'lucide-react';
import { Task } from '../types';
import { useTaskStore } from '../store/useTaskStore';
import { Badge, getStatusColors, getPriorityColors } from './Badge';

interface TaskCardProps {
    task: Task;
    onEdit?: (task: Task) => void;
}

export const TaskCard = ({ task }: TaskCardProps) => {
    const completeTask = useTaskStore(state => state.completeTask);
    const deleteTask = useTaskStore(state => state.deleteTask);

    const isCompleted = task.status === 'completed';

    return (
        <div
            className={`glass-card p-4 rounded-xl shadow-sm transition-all animate-slide-up group ${isCompleted ? 'opacity-60 grayscale-[0.5]' : 'hover:shadow-md hover:border-brand-300 dark:hover:border-brand-700'
                }`}
        >
            <div className="flex items-start gap-4">
                <button
                    onClick={() => !isCompleted && completeTask(task.id)}
                    className={`mt-1 flex-shrink-0 transition-colors ${isCompleted
                        ? 'text-emerald-500 cursor-default'
                        : 'text-slate-300 hover:text-brand-500 dark:text-slate-600 dark:hover:text-brand-500'
                        }`}
                >
                    {isCompleted ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                </button>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className={`font-semibold truncate ${isCompleted ? 'line-through text-slate-500 dark:text-slate-400' : 'text-slate-800 dark:text-slate-200'
                            }`}>
                            {task.title}
                        </h3>
                        <Badge className={getStatusColors(task.status)}>
                            {task.status.replace('_', ' ')}
                        </Badge>
                    </div>

                    {task.description && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">
                            {task.description}
                        </p>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-2 mt-3">
                        <div className="flex flex-wrap text-sm items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-md text-xs font-medium flex items-center gap-1 ${getPriorityColors(task.priority)}`}>
                                <Tag size={12} />
                                {task.priority}
                            </span>

                            {task.scheduledDate && (
                                <span className={`text-xs flex items-center gap-1 ${task.status === 'overdue' ? 'text-red-500 font-medium' : 'text-slate-500 dark:text-slate-400'
                                    }`}>
                                    <Clock size={12} />
                                    {task.scheduledDate}
                                </span>
                            )}
                        </div>

                        <button
                            onClick={() => deleteTask(task.id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                            title="Delete Task"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
