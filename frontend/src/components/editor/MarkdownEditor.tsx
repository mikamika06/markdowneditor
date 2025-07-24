import { useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useUpdateNoteMutation } from '../../hooks/useNotesQuery';
import { useNotesStore } from '../../stores/notesStore';
import { useDebouncedCallback } from '../../hooks/useDebouncedCallback';

export function MarkdownEditor() {
    const { currentNote } = useNotesStore();
    const [content, setContent] = useState('');
    const updateNoteMutation = useUpdateNoteMutation();
    
    useEffect(() => {
        if (currentNote) {
            setContent(currentNote.content);
        }
    }, [currentNote]);
    
    const debouncedSave = useDebouncedCallback((value: string) => {
        if (currentNote && value !== currentNote.content) {
            updateNoteMutation.mutate({
                id: currentNote.id,
                data: { content: value }
            });
        }
    }, 1000);

    const handleChange = (value: string) => {
        setContent(value);
        debouncedSave(value);
    };

    if (!currentNote) {
        return (
            <div className="flex-1 flex items-center justify-center p-4 text-gray-500">
                <div className="text-center">
                    <p className="mb-2">Select a note from the list or create a new one</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full">
            <div className="border-b px-4 py-2 flex justify-between items-center">
                <h2 className="font-medium">{currentNote.title}</h2>
                {updateNoteMutation.isPending && (
                    <span className="text-xs text-blue-500">Saving...</span>
                )}
            </div>
            
            <div className="flex-1 flex divide-x">
                
                <div className="w-1/2 h-full overflow-auto">
                    <div className="bg-gray-50 px-3 py-1 text-xs font-medium">Markdown Editor</div>
                    <CodeMirror
                        value={content}
                        onChange={handleChange}
                        extensions={[markdown()]}
                        height="100%"
                        theme="light"
                        basicSetup={{
                            lineNumbers: true,
                            foldGutter: false,
                        }}
                    />
                </div>
                
                <div className="w-1/2 h-full overflow-auto">
                    <div className="bg-gray-50 px-3 py-1 text-xs font-medium">HTML Preview</div>
                    <div className="p-4 prose prose-sm max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {content}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>
        </div>
    );
}