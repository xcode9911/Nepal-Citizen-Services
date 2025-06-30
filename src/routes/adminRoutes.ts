import express from 'express';
import { createUser, adminLogin, verifyAdminOtp, getAllUsers } from '../controller/adminController'; // Import getAllUsers
import catchAsync from '../utils/catchAsync';

const adminRouter = express.Router();

// Route to create a user
adminRouter.post('/create-user', catchAsync(createUser));

// Route for admin login
adminRouter.post('/admin-login', catchAsync(adminLogin));

// Route for OTP verification
adminRouter.post('/verify-otp', catchAsync(verifyAdminOtp));

// Route to get all users
adminRouter.get('/users', catchAsync(getAllUsers)); // Add this line

export default adminRouter;