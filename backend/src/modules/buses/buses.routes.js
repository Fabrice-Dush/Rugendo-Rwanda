import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/role.middleware.js';

const router = Router();

// TODO: Bus CRUD
router.get('/', authenticate, requireRole('ADMIN', 'SUPER_ADMIN'), (_req, res) => {
  res.json({ success: true, message: 'Buses list — TODO', data: [] });
});

export default router;
