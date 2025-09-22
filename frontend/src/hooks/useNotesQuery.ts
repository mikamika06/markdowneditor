import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notesService } from '../services/notesService';
import { useNotesStore } from '../stores/notesStore';
import type { CreateNoteRequest, UpdateNoteRequest } from '../types/note.types';

export function useNotesQuery() {
    const { setNotes, setLoading, setError } = useNotesStore();

    return useQuery({
        queryKey: ['notes'],
        queryFn: async () => {
            setLoading(true);
            try {
                const notes = await notesService.getNotes();
                setNotes(notes);
                setLoading(false);
                return notes;
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Failed to fetch notes');
                setLoading(false);
                throw error;
            }
        }
    });
}

export function useCreateNoteMutation() {
    const queryClient = useQueryClient();
    const { addNote } = useNotesStore();

    return useMutation({
        mutationFn: (noteData: CreateNoteRequest) =>
            notesService.createNote(noteData),
        onSuccess: (newNote) => {
            addNote(newNote);
            queryClient.invalidateQueries({ queryKey: ['notes'] });
        }
    });
}

export function useUpdateNoteMutation() {
    const queryClient = useQueryClient();
    const { updateNoteInState } = useNotesStore();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateNoteRequest }) =>
            notesService.updateNote(parseInt(id), data),
        onSuccess: (updatedNote, { id }) => {
            updateNoteInState(parseInt(id), updatedNote);
            queryClient.invalidateQueries({ queryKey: ['notes'] });
        }
    });
}

export function useDeleteNoteMutation() {
    const queryClient = useQueryClient();
    const { removeNote } = useNotesStore();

    return useMutation({
        mutationFn: (id: string) => notesService.deleteNote(parseInt(id)),
        onSuccess: (_, id) => {
            removeNote(parseInt(id));
            queryClient.invalidateQueries({ queryKey: ['notes'] });
        }
    });
}