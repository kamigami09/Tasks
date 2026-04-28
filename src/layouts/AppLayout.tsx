import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';

export const AppLayout = () => {
    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar className="hidden md:flex" />
            <div className="flex-1 flex flex-col relative w-full">
                <Header />
                <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 hide-scrollbar">
                    <Outlet />
                </main>
                {/* Mobile bottom nav could go here or inside Sidebar logic */}
                <Sidebar className="flex md:hidden absolute bottom-0 w-full h-16 border-t dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 z-50 backdrop-blur-md" isMobile />
            </div>
        </div>
    );
};
