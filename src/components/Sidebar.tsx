import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, CalendarDays, CalendarClock, Settings } from 'lucide-react';

interface SidebarProps {
    className?: string;
    isMobile?: boolean;
}

export const Sidebar = ({ className = '', isMobile = false }: SidebarProps) => {
    const navItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Today', path: '/today', icon: CalendarClock },
        { name: 'This Week', path: '/week', icon: CalendarDays },
        { name: 'This Month', path: '/month', icon: Calendar },
        { name: 'Settings', path: '/settings', icon: Settings },
    ];

    const desktopClasses = `w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-col p-4`;
    const mobileClasses = `flex-row justify-around items-center px-2 py-1`;

    return (
        <aside className={`${isMobile ? mobileClasses : desktopClasses} ${className}`}>
            {!isMobile && (
                <div className="mb-8 px-4 flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
                        <span className="text-white font-bold text-xl">T</span>
                    </div>
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-brand-400">
                        Task Follow
                    </h1>
                </div>
            )}

            <nav className={`flex ${isMobile ? 'w-full justify-between' : 'flex-col space-y-1'}`}>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200 ${isActive
                                    ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 font-medium'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                                } ${isMobile ? 'flex-col py-1 gap-1 px-2' : ''}`
                            }
                        >
                            <Icon size={isMobile ? 20 : 20} />
                            <span className={`${isMobile ? 'text-[10px]' : 'text-sm'}`}>{item.name}</span>
                        </NavLink>
                    );
                })}
            </nav>
        </aside>
    );
};
