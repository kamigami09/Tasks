import { useState } from 'react';
import { useTaskStore } from '../store/useTaskStore';
import { TaskForm } from '../components/TaskForm';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableTaskItem } from '../components/SortableTaskItem';

export const DailyPage = () => {
    const [showForm, setShowForm] = useState(false);
    const tasks = useTaskStore(state => state.tasks);

    // Current local Date ISO
    const today = new Date();
    const todayPrefix = today.toISOString().split('T')[0];

    const dailyTasks = tasks.filter(t => t.level === 'daily' && t.scheduledDate === todayPrefix);
    const sortedTasks = [...dailyTasks].sort((a, b) => {
        // First sort by completed status
        if (a.status === 'completed' && b.status !== 'completed') return 1;
        if (a.status !== 'completed' && b.status === 'completed') return -1;
        // Then by order index
        return (a.orderIndex || 0) - (b.orderIndex || 0);
    });

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            useTaskStore.getState().reorderTasks(active.id as string, over.id as string);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
            <div className="flex justify-between items-end border-b dark:border-slate-800 pb-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Daily To-Do
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 capitalize font-medium text-brand-600 dark:text-brand-400">
                        {format(today, 'EEEE, MMMM do')}
                    </p>
                </div>
                <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
                    <Plus size={18} /> <span className="hidden sm:inline">Add Task</span>
                </button>
            </div>

            {showForm && (
                <TaskForm
                    level="daily"
                    defaultDate={todayPrefix}
                    onSuccess={() => setShowForm(false)}
                    onCancel={() => setShowForm(false)}
                />
            )}

            {sortedTasks.length === 0 && !showForm ? (
                <div className="text-center py-24 text-slate-500 glass-card rounded-2xl border-dashed">
                    <div className="w-16 h-16 bg-brand-50 dark:bg-brand-500/10 text-brand-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Plus size={32} />
                    </div>
                    <h3 className="text-lg font-medium dark:text-slate-300">Nothing planned for today</h3>
                    <p className="mt-1">Add a task or move one from your weekly plan.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={sortedTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                            {sortedTasks.map(task => (
                                <SortableTaskItem key={task.id} task={task} />
                            ))}
                        </SortableContext>
                    </DndContext>
                </div>
            )}
        </div>
    );
};
