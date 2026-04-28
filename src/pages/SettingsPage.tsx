import { useTaskStore } from '../store/useTaskStore';
import { storageService } from '../services/storageService';
import { Database, Trash2 } from 'lucide-react';

export const SettingsPage = () => {
    const tasks = useTaskStore(state => state.tasks);

    const handleExport = () => {
        const json = JSON.stringify(tasks, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `task-follow-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleWipe = () => {
        if (confirm('Are you absolutely sure? This will delete all your tasks forever. Validation cannot be undone.')) {
            storageService.clear();
            window.location.reload();
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Settings</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your data preferences.</p>
            </div>

            <div className="glass-card rounded-2xl divide-y dark:divide-slate-800">
                <div className="p-6 flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold dark:text-white flex items-center gap-2">
                            <Database size={18} className="text-brand-500" />
                            Export Data
                        </h3>
                        <p className="text-sm text-slate-500 mt-1 text-balance">
                            Download your complete task history as a JSON string. Good for backups!
                        </p>
                    </div>
                    <button onClick={handleExport} className="btn-secondary">Export JSON</button>
                </div>

                <div className="p-6 flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-red-600 flex items-center gap-2">
                            <Trash2 size={18} />
                            Danger Zone
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                            Wipe all data. This cannot be undone.
                        </p>
                    </div>
                    <button onClick={handleWipe} className="bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-500/10 dark:hover:bg-red-500/20 px-4 py-2 rounded-lg font-medium transition-colors">
                        Wipe Data
                    </button>
                </div>
            </div>
        </div>
    );
};
