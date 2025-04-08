import dotenv from 'dotenv';

dotenv.config();

export default {
  database: process.env.DB_NAME || 'payment_gateway',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT,
  dialect: 'postgres',
};
