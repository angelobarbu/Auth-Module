import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import { sequelize } from './models/index.js';

const app = express();

// Helmet — secure headers
app.use(helmet());

// Rate Limiter — global (can be per-route if needed)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // limit each IP to 100 requests
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// 🌐 CORS config
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// JSON parsing
app.use(express.json());

// Routes
app.use('/api', authRoutes);
app.use('/api/admin', adminRoutes);

// Sync models on startup
sequelize.authenticate()
  .then(async () => {
    console.log('Database connected...');
    await sequelize.sync({ alter: true });
    console.log('Database synced...');
  })
  .catch((err) => console.error('Database connection error:', err));

export default app;
