import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as IOServer } from 'socket.io';
import UserRouter from './routes/userRouter';
import adminRouter from './routes/adminRoutes';
import { setupWebSocket } from './controller/userController';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = setupWebSocket(httpServer); // Initialize WebSocket

interface CustomRequest extends Request {
  io?: IOServer;
}

app.use(cors());
app.use(express.json());

// Middleware to attach io to request
app.use((req: CustomRequest, _res: Response, next: NextFunction) => {
  req.io = io;
  next();
});

app.get('/', (req: Request, res: Response) => {
  console.log(req.method);
  res.send('This is the backend server of Nepal Citizen Services, Whatsup visitor!!');
});

// Routes
app.use('/api/users', UserRouter(io));
app.use('/api/admin', adminRouter);

// Server listen
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

