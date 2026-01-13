import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { auditLog } from '../middleware/audit';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = Router();

// Admin only: create a user
router.post(
  '/',
  authenticate,
  authorize('user:create'),
  auditLog('CREATE_USER'),
  UserController.createUser
);

// Admin only: toggle status
router.patch(
  '/:id/status',
  authenticate,
  authorize('user:manage'),
  auditLog('UPDATE_USER_STATUS'),
  UserController.updateStatus
);

// Protected: get self profile
router.get(
  '/me',
  authenticate,
  UserController.getMe
);

export default router;
