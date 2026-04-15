import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/role.middleware.js';
import prisma from '../../lib/prisma.js';

const router = Router();

// Public: list all active routes (for homepage popular routes / autocomplete)
router.get('/', async (_req, res) => {
  try {
    const routes = await prisma.route.findMany({
      where:   { isActive: true },
      orderBy: [{ origin: 'asc' }, { destination: 'asc' }],
      select:  { id: true, origin: true, destination: true, distanceKm: true, durationMin: true },
    });
    return res.json({ success: true, data: routes });
  } catch (err) {
    console.error('listRoutes error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch routes' });
  }
});

// Admin: route CRUD (stub — implemented in later phase)
router.post('/', authenticate, requireRole('ADMIN', 'SUPER_ADMIN'), (_req, res) => {
  res.json({ success: true, message: 'Create route — TODO' });
});

export default router;
