import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import taskRouter from './route/task.js';
import cors from 'cors';

dotenv.config();  // Load environment variables from .env

const app = express();
const PORT = process.env.PORT || 5000;  // Default to port 5000 if PORT is not defined

// MongoDB Connection with Mongoose
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Connection Error: ', err));

// Middleware
app.use(express.urlencoded({ extended: false }));  // Parse URL-encoded data
app.use(express.json());  // Parse JSON data
app.use(cors());  // Enable CORS

// Define your API routes
app.use('/api/v1/task', taskRouter);

// Handle base route
app.get('/', (req, res) => {
  res.json({ status: 'Yes, API is working!' });
});

// Error handling middleware for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
