import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useTaskStore } from './store/useTaskStore';
import { useAuthStore } from './store/useAuthStore';
import { AppLayout } from './layouts/AppLayout';

import { DashboardPage } from './pages/DashboardPage';
import { MonthlyPage } from './pages/MonthlyPage';
import { WeeklyPage } from './pages/WeeklyPage';
import { DailyPage } from './pages/DailyPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

const ProtectedLayout = () => {
    const token = useAuthStore(state => state.token);
    if (!token) return <Navigate to="/login" replace />;
    return <AppLayout />;
};

function App() {
    const initialize = useTaskStore(state => state.initialize);

    useEffect(() => {
        // Still initializing local store for cached offline-feel logic
        initialize();
    }, [initialize]);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route element={<ProtectedLayout />}>
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
