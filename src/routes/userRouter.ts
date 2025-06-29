import express from 'express';
import { activateUser, verifyActivationOTP, login, verifyLoginOTP } from '../controller/userController';
import catchAsync from '../utils/catchAsync';

const router = express.Router();

router.post('/activate', catchAsync(activateUser));
router.post('/verify-activation-otp', catchAsync(verifyActivationOTP));
router.post('/login', catchAsync(login));
router.post('/verify-login-otp', catchAsync(verifyLoginOTP));

export default router;