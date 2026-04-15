import { Router } from 'express';
import { getMe, updateMe } from './users.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/me', authenticate, getMe);
router.patch('/me', authenticate, updateMe);

export default router;
