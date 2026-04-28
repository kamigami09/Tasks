import { useTaskStore } from '../store/useTaskStore';
import { TaskCard } from '../components/TaskCard';
import { AlertCircle, CalendarClock, Target, Sparkles, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { aiService } from '../services/aiService';

export const DashboardPage = () => {
    const tasks = useTaskStore(state => state.tasks);

    const todayPrefix = new Date().toISOString().split('T')[0];

    const todayTasks = tasks.filter(t => t.level === 'daily' && t.scheduledDate === todayPrefix);
    const overdueTasks = tasks.filter(t => t.status === 'overdue');

    const pendingToday = todayTasks.filter(t => t.status !== 'completed').length;
    const completedToday = todayTasks.filter(t => t.status === 'completed').length;
    const totalToday = todayTasks.length;

    const progress = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

    const [aiPrompt, setAiPrompt] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const addTask = useTaskStore(state => state.addTask);
    const kimiApiKey = useTaskStore(state => state.kimiApiKey);

    // Request notification permissions on Dashboard load
    useEffect(() => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, []);

    const handleMagicAdd = async () => {
        if (!aiPrompt.trim()) return;

        if (!kimiApiKey || kimiApiKey.trim() === '') {
            alert("No API Key Provided! Please go to Settings to add your Kimi API Key.");
            return;
        }

        setIsThinking(true);
        try {
            const results = await aiService.parsePromptIntoTasks(aiPrompt, kimiApiKey);
            results.forEach(aiTask => {
                addTask({
                    title: aiTask.title,
                    level: aiTask.level,
                    description: aiTask.description,
                    priority: 'medium',
                    status: 'pending'
                });
            });
            setAiPrompt('');
        } catch (error) {
            console.error('Failed to parse AI tasks', error);
        } finally {
            setIsThinking(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">

            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Here is what needs your attention.</p>
                </div>
            </div>

            <div className="glass-card rounded-2xl p-4 shadow-sm border border-brand-200 dark:border-brand-900/50 flex flex-col md:flex-row gap-3 items-stretch animate-slide-up">
                <div className="flex-1">
                    <div className="flex items-center gap-1.5 text-brand-600 dark:text-brand-400 font-semibold text-sm mb-2">
                        <Sparkles size={16} /> Autonomous AI Breakdown
                    </div>
                    <textarea
                        disabled={isThinking}
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="E.g. 'I want to build a portfolio website before Friday'..."
                        className="w-full bg-slate-50 dark:bg-slate-900/50 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none resize-none hide-scrollbar text-slate-800 dark:text-slate-200 transition-all border border-slate-200/50 dark:border-slate-800"
                        rows={2}
                    />
                </div>
                <div className="flex items-end">
                    <button
                        disabled={isThinking || !aiPrompt.trim()}
                        onClick={handleMagicAdd}
                        className="h-[52px] w-full md:w-auto px-6 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isThinking ? <><Loader2 size={18} className="animate-spin" /> Thinking...</> : 'Magic Add'}
                    </button>
                </div>
            </div>

            {overdueTasks.length > 0 && (
                <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-4 flex items-start gap-3 shadow-sm">
                    <AlertCircle className="text-red-500 shrink-0 mt-0.5" />
                    <div>
                        <h3 className="text-red-800 dark:text-red-400 font-medium">You have {overdueTasks.length} overdue tasks</h3>
                        <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                            Review them and reschedule or carry them forward to today.
                        </p>
                        <div className="mt-3 flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                            {overdueTasks.map(task => (
                                <div key={task.id} className="min-w-[280px]">
                                    <TaskCard task={task} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Progress Card */}
                <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <Target size={120} />
                    </div>
                    <h3 className="text-lg font-semibold dark:text-white relative z-10">Today's Progress</h3>
                    <div className="flex items-end gap-2 mt-4 relative z-10">
                        <span className="text-5xl font-bold tracking-tighter text-brand-500">{progress}%</span>
                    </div>

                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 mt-6 relative z-10 overflow-hidden">
                        <div
                            className="bg-brand-500 h-3 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 relative z-10">
                        {completedToday} of {totalToday} tasks completed
                    </p>
                </div>

                {/* Today Quick Launch */}
                <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
                    <div>
                        <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center text-orange-500 mb-4">
                            <CalendarClock size={24} />
                        </div>
                        <h3 className="text-lg font-semibold dark:text-white">Daily Focus</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            You have {pendingToday} tasks pending for today. Step by step!
                        </p>
                    </div>
                    <Link to="/today" className="mt-6 btn-secondary text-center w-full block">
                        View Today's List
                    </Link>
                </div>
            </div>

        </div>
    );
};
