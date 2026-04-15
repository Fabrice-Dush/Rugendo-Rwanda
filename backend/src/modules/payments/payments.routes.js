import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();

// Simulated payment initiation
router.post('/initiate', authenticate, (_req, res) => {
  res.json({ success: true, message: 'Payment initiation — TODO (simulated)' });
});

router.post('/confirm', authenticate, (_req, res) => {
  res.json({ success: true, message: 'Payment confirmation — TODO (simulated)' });
});

export default router;
