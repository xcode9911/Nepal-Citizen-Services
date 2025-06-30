import express from 'express';
import { activateUser, verifyActivationOTP, login, verifyLoginOTP, getNotifications } from '../controller/userController';
import catchAsync from '../utils/catchAsync';

const UserRouter = (io: any) => {
  const router = express.Router();
  router.post('/activate', catchAsync(activateUser(io)));
  router.post('/verify-activation-otp', catchAsync(verifyActivationOTP(io)));
  router.post('/login', catchAsync(login(io)));
  router.post('/verify-login-otp', catchAsync(verifyLoginOTP(io)));
  router.get('/notifications/:userId', catchAsync(getNotifications));
  return router;
};

export default UserRouter;