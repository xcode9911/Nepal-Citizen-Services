import express from 'express';
import { createUser } from '../controller/adminController';
import catchAsync from '../utils/catchAsync';

const adminRouter = express.Router();

// Route to create a new user
adminRouter.post('/create-user', catchAsync(createUser));

export default adminRouter;