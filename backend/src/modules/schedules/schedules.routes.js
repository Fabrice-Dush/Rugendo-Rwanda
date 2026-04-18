import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/role.middleware.js';
import { validateSearchSchedules } from './schedules.validator.js';
import { handleSearchSchedules, handleGetScheduleById } from './schedules.controller.js';

const router = Router();

// Public: search available schedules by route and date
router.get('/search', validateSearchSchedules, handleSearchSchedules);

// Public: get a single schedule by ID (used by booking summary page)
router.get('/:id', handleGetScheduleById);

// Admin: full schedules list (stub — implemented in later phase)
router.get('/', authenticate, requireRole('ADMIN', 'SUPER_ADMIN'), (_req, res) => {
  res.json({ success: true, message: 'Schedules list — TODO', data: [] });
});

export default router;
