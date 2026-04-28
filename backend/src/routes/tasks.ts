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

export default router;
