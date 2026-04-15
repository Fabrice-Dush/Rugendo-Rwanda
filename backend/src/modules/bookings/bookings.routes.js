import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/role.middleware.js';

const router = Router();

// Passenger
router.post('/', authenticate, requireRole('PASSENGER'), (_req, res) => {
  res.json({ success: true, message: 'Create booking — TODO' });
});
router.get('/my', authenticate, requireRole('PASSENGER'), (_req, res) => {
  res.json({ success: true, message: 'My bookings — TODO', data: [] });
});
router.get('/:id', authenticate, (_req, res) => {
  res.json({ success: true, message: 'Get booking — TODO' });
});
router.patch('/:id/cancel', authenticate, (_req, res) => {
  res.json({ success: true, message: 'Cancel booking — TODO' });
});

// Admin
router.get('/', authenticate, requireRole('ADMIN', 'SUPER_ADMIN'), (_req, res) => {
  res.json({ success: true, message: 'All bookings — TODO', data: [] });
});

export default router;
