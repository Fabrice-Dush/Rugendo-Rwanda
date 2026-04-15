import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/role.middleware.js';

const router = Router();

// Admin/super-admin KPIs
router.get('/stats', authenticate, requireRole('ADMIN', 'SUPER_ADMIN'), (_req, res) => {
  res.json({ success: true, message: 'Dashboard stats — TODO', data: {} });
});

export default router;
