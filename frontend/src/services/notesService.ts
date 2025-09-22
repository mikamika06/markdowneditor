import { api } from './api';
import type { Note, CreateNoteRequest, UpdateNoteRequest } from '../types/note.types';

export const notesService = {
  async getNotes(): Promise<Note[]> {
    const response = await api.get('/notes');
    return response.data;
  },

  async getNote(id: number): Promise<Note> {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  },

  async createNote(data: CreateNoteRequest): Promise<Note> {
    const response = await api.post('/notes', data);
    return response.data;
  },

  async updateNote(id: number, data: UpdateNoteRequest): Promise<Note> {
    const response = await api.put(`/notes/${id}`, data);
    return response.data;
  },

  async deleteNote(id: number): Promise<void> {
    await api.delete(`/notes/${id}`);
  },

  async getNoteAsHtml(id: string): Promise<string> {
    const response = await api.get(`/notes/${id}/html`);
    if (typeof response.data === 'string') {
      return response.data;
    } else if (response.data.html) {
      return response.data.html;
    } else {
      console.error('Unexpected response format:', response.data);
      return '<p>Помилка рендерингу HTML</p>';
    }
  },
};