import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import taskRouter from './route/task.js';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Connection Error: ', err));


const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests, please try again after 15 minutes'
});

app.use(limiter);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({
  // origin: 'http://localhost:5173'
  origin: 'https://taskify-main.vercel.app'
}));


app.use('/api/v1/task', taskRouter);


app.get('/', (req, res) => {
  res.json({ status: 'Yes, API is working!' });
});


app.use((req, res) => {
  res.status(404).json({ error: 'Oops! Not Found' });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
