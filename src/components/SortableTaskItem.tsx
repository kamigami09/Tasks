import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../types';
import { TaskCard } from './TaskCard';
import { GripVertical } from 'lucide-react';

interface SortableTaskItemProps {
    task: Task;
}

export const SortableTaskItem = ({ task }: SortableTaskItemProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.8 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className={`relative flex items-center group transition-opacity ${isDragging ? 'opacity-80 scale-[1.02] shadow-xl' : ''}`}>
            <div
                {...attributes}
                {...listeners}
                className="absolute -left-6 cursor-grab active:cursor-grabbing p-2 text-slate-300 hover:text-brand-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <GripVertical size={18} />
            </div>
            <div className="flex-1 w-full ml-1">
                <TaskCard task={task} />
            </div>
        </div>
    );
};
