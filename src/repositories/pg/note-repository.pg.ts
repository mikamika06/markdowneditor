import { pool } from '../../config/database';
import { INoteRepository } from '../interfaces/note-repository.interface';
import { Note } from '../../models/note.model';
import crypto from 'crypto';

export class PgNoteRepository implements INoteRepository {
    async create(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> {
        const id = crypto.randomUUID();
        const query = `
      INSERT INTO notes (id, user_id, title, content)
      VALUES ($1, $2, $3, $4)
      RETURNING id, user_id as "userId", title, content, created_at as "createdAt", updated_at as "updatedAt"
    `;

        const { rows } = await pool.query(query, [id, note.userId, note.title, note.content]);
        return rows[0];
    }

    async findById(id: string): Promise<Note | null> {
        const query = `
      SELECT id, user_id as "userId", title, content, created_at as "createdAt", updated_at as "updatedAt"
      FROM notes
      WHERE id = $1
    `;

        const { rows } = await pool.query(query, [id]);
        return rows.length ? rows[0] : null;
    }

    async update(id: string, data: Partial<Omit<Note, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<Note | null> {
        const note = await this.findById(id);
        if (!note) return null;

        const updates: string[] = [];
        const values: any[] = [id];
        let paramCounter = 2;

        if (data.title !== undefined) {
            updates.push(`title = $${paramCounter}`);
            values.push(data.title);
            paramCounter++;
        }

        if (data.content !== undefined) {
            updates.push(`content = $${paramCounter}`);
            values.push(data.content);
            paramCounter++;
        }

        updates.push(`updated_at = CURRENT_TIMESTAMP`);

        if (updates.length === 0) {
            return note;
        }

        const query = `
      UPDATE notes
      SET ${updates.join(', ')}
      WHERE id = $1
      RETURNING id, user_id as "userId", title, content, created_at as "createdAt", updated_at as "updatedAt"
    `;

        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    async delete(id: string): Promise<boolean> {
        const query = `
      DELETE FROM notes
      WHERE id = $1
      RETURNING id
    `;

        const result = await pool.query(query, [id]);
        return (result.rowCount || 0) > 0;
    }

    async findAllByUserId(userId: string): Promise<Note[]> {
        const query = `
      SELECT id, user_id as "userId", title, content, created_at as "createdAt", updated_at as "updatedAt"
      FROM notes
      WHERE user_id = $1
      ORDER BY updated_at DESC
    `;

        const { rows } = await pool.query(query, [userId]);
        return rows;
    }
}