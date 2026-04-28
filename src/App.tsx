import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useTaskStore } from './store/useTaskStore';
import { AppLayout } from './layouts/AppLayout';

// Base Placeholder Pages imports
import { DashboardPage } from './pages/DashboardPage';
import { MonthlyPage } from './pages/MonthlyPage';
import { WeeklyPage } from './pages/WeeklyPage';
import { DailyPage } from './pages/DailyPage';
import { SettingsPage } from './pages/SettingsPage';

function App() {
    const initialize = useTaskStore(state => state.initialize);

    useEffect(() => {
        initialize();
    }, [initialize]);

    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/month" element={<MonthlyPage />} />
                    <Route path="/week" element={<WeeklyPage />} />
                    <Route path="/today" element={<DailyPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
