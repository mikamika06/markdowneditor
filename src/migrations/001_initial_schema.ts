import { pool } from '../config/database';

export async function up() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS notes (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
    
    await client.query('COMMIT');
    console.log('Migrations applied successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error applying migrations:', error);
    throw error;
  } finally {
    client.release();
  }
}

export async function down() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DROP TABLE IF EXISTS notes');
    await client.query('DROP TABLE IF EXISTS users');
    await client.query('COMMIT');
    console.log('Rollback completed successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error rolling back migrations:', error);
    throw error;
  } finally {
    client.release();
  }
}