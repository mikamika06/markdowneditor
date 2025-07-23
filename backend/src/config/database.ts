import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const getDatabaseConfig = () => {
  if (process.env.DATABASE_URL) {
    const connectionString = process.env.DATABASE_URL;
    return {
      connectionString,
      ssl: {
        rejectUnauthorized: false 
      }
    };
  }

  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'markdowneditor',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres'
  };
};

export const pool = new Pool(getDatabaseConfig());

export const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('Successfully connected to PostgreSQL');
    client.release();
    return true;
  } catch (error) {
    console.error('Failed to connect to PostgreSQL', error);
    return false;
  }
};