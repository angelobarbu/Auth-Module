import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import { sequelize } from '../models/index.js';

export default async () => {
  // For SQLite memory db we just sync.
  await sequelize.authenticate();
  await sequelize.sync({ force: true });
};