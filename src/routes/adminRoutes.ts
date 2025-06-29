import express from 'express';
import { createUser, adminLogin, verifyAdminOtp } from '../controller/adminController';
import catchAsync from '../utils/catchAsync';

const adminRouter = express.Router();

adminRouter.post('/create-user', catchAsync(createUser));
adminRouter.post('/admin-login', catchAsync(adminLogin));
adminRouter.post('/verify-otp', catchAsync(verifyAdminOtp));

export default adminRouter;
