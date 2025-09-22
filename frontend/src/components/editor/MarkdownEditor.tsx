import { markdown } from "@codemirror/lang-markdown";
import CodeMirror from "@uiw/react-codemirror";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "../../hooks/useDebouncedCallback";
import { useUpdateNoteMutation } from "../../hooks/useNotesQuery";
import { api } from "../../services/api";
import { notesService } from "../../services/notesService";
import { useNotesStore } from "../../stores/notesStore";
export function MarkdownEditor() {
  const { currentNote } = useNotesStore();
  const [content, setContent] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState("");
  const updateNoteMutation = useUpdateNoteMutation();
  const [htmlContent, setHtmlContent] = useState("");
  const [isLoadingHtml, setIsLoadingHtml] = useState(false);

  useEffect(() => {
    if (currentNote) {
      setContent(currentNote.content);
      setTitle(currentNote.title);
      fetchHtmlContent(currentNote.id);
    }
  }, [currentNote, currentNote?.content]); // додаємо currentNote?.content як залежність

  const fetchHtmlContent = async (noteId: number) => {
    setIsLoadingHtml(true);
    try {
      console.log("Fetching HTML for note:", noteId);
      const response = await api.get(`/notes/${noteId}/html`);
      console.log("Raw server response:", response);

      const html = await notesService.getNoteAsHtml(noteId.toString());
      console.log("Processed HTML content:", html.substring(0, 100) + "..."); // показуємо перші 100 символів

      setHtmlContent(html);
    } catch (error) {
      console.error("Error fetching HTML content:", error);
      setHtmlContent("<p>Помилка завантаження HTML</p>");
    } finally {
      setIsLoadingHtml(false);
    }
  };

  const debouncedSaveContent = useDebouncedCallback((value: string) => {
    if (currentNote && value !== currentNote.content) {
      updateNoteMutation.mutate({
        id: currentNote.id.toString(),
        data: { content: value },
      });
      fetchHtmlContent(currentNote.id);
    }
  }, 1000);

  const handleChange = (value: string) => {
    setContent(value);
    debouncedSaveContent(value);
  };

  const handleSaveTitle = () => {
    if (currentNote && title !== currentNote.title) {
      updateNoteMutation.mutate({
        id: currentNote.id.toString(),
        data: { title },
      });
    }
    setIsEditingTitle(false);
  };

  if (!currentNote) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 text-gray-500">
        <div className="text-center">
          <p className="mb-2">
            Select a note from the list or create a new one
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="border-b px-4 py-2 flex justify-between items-center">
        {isEditingTitle ? (
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border px-2 py-1 rounded"
              autoFocus
              onBlur={handleSaveTitle}
              onKeyDown={(e) => e.key === "Enter" && handleSaveTitle()}
            />
            <button
              onClick={handleSaveTitle}
              className="text-xs bg-gray-700 text-white px-2 py-1 rounded"
            >
              Save
            </button>
          </div>
        ) : (
          <h2
            className="font-medium cursor-pointer hover:text-gray-700"
            onClick={() => setIsEditingTitle(true)}
          >
            {currentNote.title}{" "}
            <span className="text-xs text-gray-400">(click to edit)</span>
          </h2>
        )}
        {updateNoteMutation.isPending && (
          <span className="text-xs text-gray-600">Saving...</span>
        )}
      </div>

      <div
        className="flex-1 flex flex-col lg:flex-row"
        style={{ height: "calc(100vh - 100px)" }}
      >
        <div className="w-full lg:w-1/2 flex flex-col border-r">
          <div className="bg-gray-50 px-3 py-1 text-xs font-medium border-b">
            Markdown Editor
          </div>
          <div className="flex-1 overflow-auto">
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
        </div>

        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="bg-gray-50 px-3 py-1 text-xs font-medium border-b flex justify-between items-center">
            <span>HTML Preview</span>
            {isLoadingHtml && (
              <span className="text-xs text-gray-600">Loading...</span>
            )}
          </div>
          <div className="flex-1 p-4 overflow-auto">
            {isLoadingHtml ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700"></div>
              </div>
            ) : (
              <div
                className="markdown-content"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
