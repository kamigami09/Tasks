import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from './auth';

const router = Router();
const prisma = new PrismaClient();

// Ensure all task routes are protected
router.use(requireAuth);

router.get('/', async (req: any, res) => {
    const tasks = await prisma.task.findMany({
        where: { userId: req.user.userId },
        orderBy: { orderIndex: 'asc' }
    });
    res.json(tasks);
});

router.post('/', async (req: any, res) => {
    const task = await prisma.task.create({
        data: {
            ...req.body,
            userId: req.user.userId,
        }
    });
    res.json(task);
});

// Multi-task insert for AI generations
router.post('/batch', async (req: any, res) => {
    if (!Array.isArray(req.body.tasks)) return res.status(400).json({ error: 'Needs tasks array' });
    const tasksToCreate = req.body.tasks.map((t: any) => ({ ...t, userId: req.user.userId }));

    await prisma.task.createMany({
        data: tasksToCreate
    });

    const created = await prisma.task.findMany({ where: { userId: req.user.userId } });
    res.json(created);
});

router.put('/:id', async (req: any, res: any) => {
    const existing = await prisma.task.findUnique({ where: { id: req.params.id } });
    if (!existing || existing.userId !== req.user.userId) return res.status(403).json({ error: 'Forbidden' });

    const updated = await prisma.task.update({
        where: { id: req.params.id },
        data: req.body
    });
    res.json(updated);
});

router.delete('/:id', async (req: any, res: any) => {
    const existing = await prisma.task.findUnique({ where: { id: req.params.id } });
    if (!existing || existing.userId !== req.user.userId) return res.status(403).json({ error: 'Forbidden' });

    await prisma.task.delete({
        where: { id: req.params.id }
    });
    res.json({ success: true });
});

// Moonshot Kimi AI Task Breakdown Proxy
router.post('/ai/generate', async (req: any, res: any) => {
    const { prompt } = req.body;
    const KIMI_API_KEY = process.env.KIMI_API_KEY;

    if (!KIMI_API_KEY) return res.status(500).json({ error: 'AI Backend Key missing' });

    try {
        const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${KIMI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'moonshot-v1-8k',
                messages: [
                    {
                        role: 'system',
                        content: `You are a productivity expert. Parse the user prompt into a JSON array of tasks. 
                        Each task MUST follow this interface:
                        {
                            "title": string,
                            "level": "monthly" | "weekly" | "daily",
                            "description": string
                        }
                        Break down complex goals logically. Output ONLY the JSON array.`
                    },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.3
            })
        });

        const data: any = await response.json();
        const content = data.choices[0].message.content;
        
        // Clean markdown backticks if present
        const jsonStr = content.replace(/```json/g, '').replace(/```/g, '').trim();
        const results = JSON.parse(jsonStr);

        res.json(results);
    } catch (error) {
        console.error('AI Proxy Error:', error);
        res.status(500).json({ error: 'AI processing failed' });
    }
});

export default router;
