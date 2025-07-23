import { pool } from '../../config/database';
import { IUserRepository } from '../interfaces/user-repository.interface';
import { User } from '../../models/user.model';
import crypto from 'crypto';

export class PgUserRepository implements IUserRepository {
  async create(email: string, passwordHash: string): Promise<Omit<User, 'passwordHash'>> {
    const id = crypto.randomUUID();
    const query = `
      INSERT INTO users (id, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, email
    `;
    
    const { rows } = await pool.query(query, [id, email, passwordHash]);
    return rows[0];
  }
  
  async findByEmail(email: string): Promise<User | null> {
    const query = `
      SELECT id, email, password_hash as "passwordHash"
      FROM users
      WHERE email = $1
    `;
    
    const { rows } = await pool.query(query, [email]);
    return rows.length ? rows[0] : null;
  }
  
  async findById(id: string): Promise<User | null> {
    const query = `
      SELECT id, email, password_hash as "passwordHash"
      FROM users
      WHERE id = $1
    `;
    
    const { rows } = await pool.query(query, [id]);
    return rows.length ? rows[0] : null;
  }
}