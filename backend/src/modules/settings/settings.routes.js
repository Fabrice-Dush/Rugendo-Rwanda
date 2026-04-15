import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/role.middleware.js';

const router = Router();

// Platform settings — super-admin only
router.get('/', authenticate, requireRole('SUPER_ADMIN'), (_req, res) => {
  res.json({ success: true, message: 'Platform settings — TODO', data: {} });
});

router.put('/:key', authenticate, requireRole('SUPER_ADMIN'), (_req, res) => {
  res.json({ success: true, message: 'Update setting — TODO' });
});

export default router;
