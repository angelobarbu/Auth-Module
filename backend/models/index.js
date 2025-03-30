import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import userModel from './user.js';
import config from '../config/config.js';

export const sequelize = new Sequelize(config.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
});

export const User = userModel(sequelize);   // Create the User model