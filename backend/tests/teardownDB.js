import { sequelize } from '../models/index.js';

export default async () => {
  await sequelize.close();
};