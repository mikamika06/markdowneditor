import React, { useState } from "react";
import { AIService } from "../../services/aiService";

interface AIPanelProps {
  selectedText: string;
  onTextReplace: (newText: string) => void;
  onTextInsert: (text: string) => void;
}

export const AIPanel: React.FC<AIPanelProps> = ({
  selectedText,
  onTextReplace,
  onTextInsert,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [targetLanguage, setTargetLanguage] = useState("Ukrainian");

  const handleAIAction = async (action: string) => {
    if (!selectedText) {
      setError("Set text in note");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let result: string;

      switch (action) {
        case "autocomplete":
          result = await AIService.autocomplete(selectedText);
          onTextInsert("\n\n" + result);
          break;

        case "grammar":
          result = await AIService.checkGrammar(selectedText);
          onTextReplace(result);
          break;

        case "translate":
          result = await AIService.translate(selectedText, targetLanguage);
          onTextReplace(result);
          break;

        default:
          throw new Error("Unknown AI action");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "AI operation failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border-l border-gray-200 p-4 w-80">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        AI Assistant (Ollama)
      </h3>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-3">
        <button
          onClick={() => handleAIAction("autocomplete")}
          disabled={isLoading || !selectedText}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-4 py-2 rounded text-sm transition-colors"
        >
          {isLoading ? "Loading..." : "Complete text"}
        </button>

        <button
          onClick={() => handleAIAction("grammar")}
          disabled={isLoading || !selectedText}
          className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-4 py-2 rounded text-sm transition-colors"
        >
          {isLoading ? "Loading..." : "Fix grammar"}
        </button>

        <div className="space-y-2">
          <select
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          >
            <option value="Ukrainian">Ukrainian</option>
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
          </select>
          <button
            onClick={() => handleAIAction("translate")}
            disabled={isLoading || !selectedText}
            className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white px-4 py-2 rounded text-sm transition-colors"
          >
            {isLoading ? "Loading..." : "Translate"}
          </button>
        </div>
      </div>

      <div className="mt-6 p-3 bg-gray-50 rounded text-sm text-gray-600">
        <h4 className="font-medium mb-2">How to use:</h4>
        <ol className="list-decimal list-inside space-y-1 text-xs">
          <li>Write or edit text in the editor</li>
          <li>Click the required AI function in this panel</li>
          <li>AI will process the entire note content</li>
          <li>Result will be replaced or added to the text</li>
        </ol>
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        AI Backend: http://localhost:8000/ai/
        <br />
        Model: llama3:8b (Ollama)
      </div>
    </div>
  );
};
