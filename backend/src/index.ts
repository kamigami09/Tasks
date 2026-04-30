import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import taskRoutes from './routes/tasks';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Request logging for production debugging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Detailed health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        env: process.env.NODE_ENV,
        db_configured: !!process.env.DATABASE_URL,
        ai_configured: !!process.env.KIMI_API_KEY
    });
});

app.listen(PORT, () => {
    console.log(`Backend securely running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
