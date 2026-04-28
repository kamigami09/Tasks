import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { BACKEND_URL } from '../services/apiService';

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuthStore();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`${BACKEND_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error);
                return;
            }

            login(data.token, data.user);
            navigate('/');
        } catch (err) {
            setError('Failed to connect to server.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
            <div className="glass-card max-w-md w-full p-8 rounded-2xl flex flex-col gap-6">
                <div>
                    <h1 className="text-2xl font-bold dark:text-white">Welcome Back</h1>
                    <p className="text-slate-500">Sign in to your Tasks account</p>
                </div>

                {error && <div className="p-3 bg-red-100 text-red-600 rounded-lg text-sm">{error}</div>}

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <input
                        type="email" placeholder="Email" required
                        className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 border-none outline-none dark:text-white"
                        value={email} onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password" placeholder="Password" required
                        className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 border-none outline-none dark:text-white"
                        value={password} onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" className="btn-primary py-3">Login</button>
                </form>

                <p className="text-center text-slate-500 text-sm">
                    Don't have an account? <Link to="/register" className="text-brand-500 underline">Register here</Link>
                </p>
            </div>
        </div>
    );
};
