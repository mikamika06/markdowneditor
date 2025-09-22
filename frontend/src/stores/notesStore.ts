import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Note, NotesState } from '../types/note.types';

interface NotesActions {
    setNotes: (notes: Note[]) => void;
    setCurrentNote: (note: Note | null) => void;
    addNote: (note: Note) => void;
    updateNoteInState: (id: number, updates: Partial<Note>) => void;
    removeNote: (id: number) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

type NotesStore = NotesState & NotesActions;

export const useNotesStore = create<NotesStore>()(
    devtools(
        (set) => ({
            notes: [],
            currentNote: null,
            isLoading: false,
            error: null,

            setNotes: (notes) => set({ notes }),

            setCurrentNote: (note) => set({ currentNote: note }),

            addNote: (note) => set(state => ({
                notes: [note, ...state.notes],
                currentNote: note
            })),

            updateNoteInState: (id, updates) => set(state => ({
                notes: state.notes.map(note =>
                    note.id === id ? { ...note, ...updates } : note
                ),
                currentNote: state.currentNote?.id === id
                    ? { ...state.currentNote, ...updates }
                    : state.currentNote
            })),

            removeNote: (id) => set(state => ({
                notes: state.notes.filter(note => note.id !== id),
                currentNote: state.currentNote?.id === id ? null : state.currentNote
            })),

            setLoading: (isLoading) => set({ isLoading }),

            setError: (error) => set({ error }),
        }),
        { name: 'notes-store' }
    )
);