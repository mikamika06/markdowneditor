import { Note } from '../../models/note.model';

export interface INoteRepository {
  create(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note>;
  findById(id: string): Promise<Note | null>;
  update(id: string, data: Partial<Omit<Note, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<Note | null>;
  delete(id: string): Promise<boolean>;
  findAllByUserId(userId: string): Promise<Note[]>;
}