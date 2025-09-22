import { useEffect, useState } from "react";
import {
  useCreateNoteMutation,
  useDeleteNoteMutation,
  useNotesQuery,
  useUpdateNoteMutation,
} from "../../hooks/useNotesQuery";
import { useNotesStore } from "../../stores/notesStore";
import { CompactAIPanel } from "../editor/CompactAIPanel";
import { NoteItem } from "../notes/NoteItem";

export function Sidebar() {
  const { notes, currentNote, setCurrentNote } = useNotesStore();
  const notesQuery = useNotesQuery();
  const createNoteMutation = useCreateNoteMutation();
  const deleteNoteMutation = useDeleteNoteMutation();
  const updateNoteMutation = useUpdateNoteMutation();
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState("");

  useEffect(() => {
    if (notes.length > 0 && !currentNote) {
      setCurrentNote(notes[0]);
    }
  }, [notes, currentNote, setCurrentNote]);

  const handleCreateNote = () => {
    if (isCreatingNote && newNoteTitle.trim()) {
      createNoteMutation.mutate({
        title: newNoteTitle,
        content: `# ${newNoteTitle}\n\nNew note with initial text.\n\n- Item 1\n- Item 2\n\n## Subheading\n\nParagraph text.`,
      });
      setIsCreatingNote(false);
      setNewNoteTitle("");
    } else {
      setIsCreatingNote(true);
    }
  };

  const handleDeleteNote = (id: number) => {
    if (confirm("Are you sure you want to delete this note?")) {
      deleteNoteMutation.mutate(id.toString());
    }
  };

  // Функції для AI панелі
  const replaceText = (newText: string) => {
    if (currentNote) {
      updateNoteMutation.mutate({
        id: currentNote.id.toString(),
        data: { content: newText },
      });
    }
  };

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col h-full">
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold">Notes</h2>
          {!isCreatingNote ? (
            <button
              onClick={handleCreateNote}
              className="text-xs bg-gray-700 text-white px-2 py-1 rounded hover:bg-gray-800"
              disabled={createNoteMutation.isPending}
            >
              {createNoteMutation.isPending ? "Creating..." : "New"}
            </button>
          ) : (
            <div className="flex items-center space-x-1">
              <input
                type="text"
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                placeholder="Title..."
                className="text-xs border px-2 py-1 rounded w-25"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleCreateNote()}
              />
              <button
                onClick={handleCreateNote}
                className="text-xs bg-gray-700 text-white px-2 py-1 rounded"
                disabled={!newNoteTitle.trim()}
              >
                Create
              </button>
              <button
                onClick={() => setIsCreatingNote(false)}
                className="text-xs text-gray-500"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-auto flex-1">
        {notesQuery.isLoading ? (
          <div className="p-4 text-center text-gray-500">Loading...</div>
        ) : notes.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <p>No notes</p>
            <p className="text-xs mt-1">Create your first note</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {notes.map((note) => (
              <div key={note.id} className="relative group">
                <NoteItem
                  note={note}
                  isActive={currentNote?.id === note.id}
                  onClick={() => setCurrentNote(note)}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteNote(note.id);
                  }}
                  className="absolute top-2 right-2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500"
                  title="Delete note"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Assistant Panel */}
      {currentNote && (
        <div className="border-t border-gray-200 p-3">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h3 className="text-sm font-medium text-blue-800 mb-3">
              AI Assistant
            </h3>
            <CompactAIPanel
              selectedText={currentNote.content}
              onTextReplace={replaceText}
            />
          </div>
        </div>
      )}
    </div>
  );
}
