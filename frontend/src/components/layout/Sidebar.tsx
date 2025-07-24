import { useEffect } from 'react';
import { useNotesQuery, useCreateNoteMutation } from '../../hooks/useNotesQuery';
import { useNotesStore } from '../../stores/notesStore';
import { NoteItem } from '../notes/NoteItem';

export function Sidebar() {
    const { notes, currentNote, setCurrentNote } = useNotesStore();
    const notesQuery = useNotesQuery();
    const createNoteMutation = useCreateNoteMutation();
    
    useEffect(() => {
        if (notes.length > 0 && !currentNote) {
            setCurrentNote(notes[0]);
        }
    }, [notes, currentNote, setCurrentNote]);
    
    const handleCreateNote = () => {
        createNoteMutation.mutate({
            title: 'New Note',
            content: '# New Note\n\nEnter text...'
        });
    };
    
    return (
        <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col h-full">
            <div className="p-3 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="font-semibold">Notes</h2>
                    <button
                        onClick={handleCreateNote}
                        className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                        disabled={createNoteMutation.isPending}
                    >
                        {createNoteMutation.isPending ? 'Creating...' : 'New'}
                    </button>
                </div>
            </div>
            
            <div className="overflow-auto flex-1">
                {notesQuery.isLoading ? (
                    <div className="p-4 text-center text-gray-500">Loading...</div>
                ) : notes.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                        <p>No notes</p>
                        <p className="text-xs mt-1">Create the first note</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {notes.map((note) => (
                            <NoteItem 
                                key={note.id}
                                note={note}
                                isActive={currentNote?.id === note.id}
                                onClick={() => setCurrentNote(note)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}