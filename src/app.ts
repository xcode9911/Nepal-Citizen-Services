import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import userRouter from './routes/userRouter'; 
import adminRouter from './routes/adminRoutes'; // Adjust path as necessary

dotenv.config();

const app = express();
const httpServer = createServer(app);

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  console.log(req.method);
  res.send('This is the backend server of Nepal Citizen Services, Whatsup visitor!!');
});

app.use('/api/users', userRouter); 
app.use('/api/admin', adminRouter); 

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});