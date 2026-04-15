import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/role.middleware.js';

const router = Router();

// TODO: implement operator CRUD (super-admin only)
router.get('/', authenticate, requireRole('SUPER_ADMIN'), (_req, res) => {
  res.json({ success: true, message: 'Operators list — TODO', data: [] });
});

export default router;
