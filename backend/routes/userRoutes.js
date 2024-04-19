import express from 'express';
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import cookieParser from 'cookie-parser';

const router = express.Router();
router.use(cookieParser());
router.post('/', registerUser);
router.post('/auth', authUser);
router.post('/logout', logoutUser);
router
  .route('/profile')
  .get(protect,getUserProfile)
  .put(protect,updateUserProfile);

export default router;