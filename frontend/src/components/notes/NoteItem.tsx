import { type Note } from '../../types/note.types';

interface NoteItemProps {
  note: Note;
  isActive: boolean;
  onClick: () => void;
}

export function NoteItem({ note, isActive, onClick }: NoteItemProps) {
  const formattedDate = new Date(note.updatedAt).toLocaleDateString();
  
  return (
    <div
      className={`p-3 cursor-pointer hover:bg-gray-100 ${
        isActive ? 'bg-blue-50 border-l-4 border-blue-500' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-medium truncate">{note.title}</h3>
        <div className="text-xs text-gray-500 whitespace-nowrap ml-2">
          {formattedDate}
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-1 truncate">
        {note.content.replace(/#{1,6}\s+/g, '').substring(0, 50)}
        {note.content.length > 50 ? '...' : ''}
      </p>
    </div>
  );
}