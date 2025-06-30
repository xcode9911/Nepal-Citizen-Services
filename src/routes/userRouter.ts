import express from 'express';
import { activateUser, verifyActivationOTP, login, verifyLoginOTP, getNotifications } from '../controller/userController';
import catchAsync from '../utils/catchAsync';

const router = express.Router();

router.post('/activate', catchAsync(activateUser));
router.post('/verify-activation-otp', catchAsync(verifyActivationOTP));
router.post('/login', catchAsync(login));
router.post('/verify-login-otp', catchAsync(verifyLoginOTP));
router.get('/notifications/:userId', catchAsync(getNotifications)); 

export default router;