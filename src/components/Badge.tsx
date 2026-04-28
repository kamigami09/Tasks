export const getStatusColors = (status: string) => {
    switch (status) {
        case 'completed': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20';
        case 'in_progress': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-500/20';
        case 'overdue': return 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-500/20';
        default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
};

export const getPriorityColors = (priority: string) => {
    switch (priority) {
        case 'high': return 'text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400';
        case 'medium': return 'text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400';
        default: return 'text-slate-600 bg-slate-50 dark:bg-slate-800 dark:text-slate-400';
    }
};

export const Badge = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => {
    return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${className}`}>
            {children}
        </span>
    );
};
