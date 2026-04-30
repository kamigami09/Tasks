import { Bell, LogOut } from 'lucide-react';
import { useTaskStore } from '../store/useTaskStore';
import { useAuthStore } from '../store/useAuthStore';

export const Header = () => {
    const tasks = useTaskStore(state => state.tasks);
    const logout = useAuthStore(state => state.logout);
    const overdueCount = tasks.filter(t => t.status === 'overdue').length;

    return (
        <header className="h-16 px-4 md:px-8 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white/50 dark:bg-slate-900/50 backdrop-blur-md z-10 sticky top-0">
            <div className="flex-1"></div>

            <div className="flex items-center space-x-2 md:space-x-4">
                <button className="relative p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
                    <Bell size={20} />
                    {overdueCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                        </span>
                    )}
                </button>
                
                <button 
                    onClick={() => logout()}
                    className="p-2 text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 transition-colors md:hidden"
                    title="Logout"
                >
                    <LogOut size={20} />
                </button>

                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-white dark:border-slate-700 overflow-hidden hidden md:block">
                    <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=f0f9ff" alt="User" />
                </div>
            </div>
        </header>
    );
};
