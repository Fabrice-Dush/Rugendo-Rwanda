import { Router } from 'express';
import { getMe, updateMe, deleteMe } from './users.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/me',    authenticate, getMe);
router.patch('/me',  authenticate, updateMe);
router.delete('/me', authenticate, deleteMe);

export default router;
