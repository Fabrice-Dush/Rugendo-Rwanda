import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/role.middleware.js';

const router = Router();

// Operator validates a boarding token
router.post('/validate', authenticate, requireRole('OPERATOR'), (_req, res) => {
  res.json({ success: true, message: 'Boarding validation — TODO' });
});

export default router;
