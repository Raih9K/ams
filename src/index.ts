import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/v1/auth', authRoutes);
app.use('/v1/users', userRoutes);

// Boot message
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Academy Management System (AMS) API' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
