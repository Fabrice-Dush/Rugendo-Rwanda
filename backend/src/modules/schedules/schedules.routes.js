import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/role.middleware.js';

const router = Router();

// Public: search available schedules
router.get('/search', (_req, res) => {
  res.json({ success: true, message: 'Schedule search — TODO', data: [] });
});

// Admin: manage schedules
router.get('/', authenticate, requireRole('ADMIN', 'SUPER_ADMIN'), (_req, res) => {
  res.json({ success: true, message: 'Schedules list — TODO', data: [] });
});

export default router;
