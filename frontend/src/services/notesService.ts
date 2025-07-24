import { api } from './api';
import type { Note, CreateNoteRequest, UpdateNoteRequest } from '../types/note.types';

export const notesService = {
  async getNotes(): Promise<Note[]> {
    const response = await api.get('/notes');
    return response.data;
  },

  async getNote(id: string): Promise<Note> {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  },

  async createNote(data: CreateNoteRequest): Promise<Note> {
    const response = await api.post('/notes', data);
    return response.data;
  },

  async updateNote(id: string, data: UpdateNoteRequest): Promise<Note> {
    const response = await api.put(`/notes/${id}`, data);
    return response.data;
  },

  async deleteNote(id: string): Promise<void> {
    await api.delete(`/notes/${id}`);
  },

  async getNoteAsHtml(id: string): Promise<string> {
    const response = await api.get(`/notes/${id}/html`);
    return response.data.html;
  },
};