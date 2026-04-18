import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/role.middleware.js';
import {
  handleCreateBooking,
  handleGetMyBookings,
  handleGetBookingById,
  handleCancelBooking,
  handleGetOperatorCompanyBookings,
} from './bookings.controller.js';

const router = Router();

// Passenger: create a booking
router.post('/', authenticate, requireRole('PASSENGER'), handleCreateBooking);

// Passenger: list own bookings
router.get('/my', authenticate, requireRole('PASSENGER'), handleGetMyBookings);

// Passenger: cancel a PENDING booking
router.patch('/:id/cancel', authenticate, requireRole('PASSENGER'), handleCancelBooking);

// Operator: list all bookings for operator's company
router.get('/operator-company', authenticate, requireRole('OPERATOR'), handleGetOperatorCompanyBookings);

// Authenticated: get booking by id (ownership enforced in controller for passengers)
router.get('/:id', authenticate, handleGetBookingById);

// Admin: list all bookings (stub — full implementation is next phase)
router.get('/', authenticate, requireRole('ADMIN', 'SUPER_ADMIN'), (_req, res) => {
  res.json({ success: true, message: 'All bookings — TODO', data: [] });
});

export default router;
