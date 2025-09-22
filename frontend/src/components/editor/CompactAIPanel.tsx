import React, { useState } from "react";
import { AIService } from "../../services/aiService";

interface CompactAIPanelProps {
  selectedText: string;
  onTextReplace: (newText: string) => void;
}

export const CompactAIPanel: React.FC<CompactAIPanelProps> = ({
  selectedText,
  onTextReplace,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [targetLanguage, setTargetLanguage] = useState("Ukrainian");

  const handleAIAction = async (action: string) => {
    if (!selectedText) {
      setError("Please create content in the note first");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let result: string;

      switch (action) {
        case "autocomplete":
          result = await AIService.autocomplete(selectedText);
          onTextReplace(selectedText + "\n\n" + result);
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

      console.log(`AI ${action} completed:`, result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "AI Error";
      console.error(`AI ${action} error:`, err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      {error && (
        <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
          Processing...
        </div>
      )}

      <div className="grid grid-cols-2 gap-1">
        <button
          onClick={() => handleAIAction("autocomplete")}
          disabled={isLoading || !selectedText}
          className="text-xs bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-2 py-1 rounded transition-colors"
          title="Autocomplete text"
        >
          Continue
        </button>

        <button
          onClick={() => handleAIAction("grammar")}
          disabled={isLoading || !selectedText}
          className="text-xs bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-2 py-1 rounded transition-colors"
          title="Fix grammar"
        >
          Grammar
        </button>

        <button
          onClick={() => handleAIAction("translate")}
          disabled={isLoading || !selectedText}
          className="text-xs bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white px-2 py-1 rounded transition-colors"
          title="Translate text"
        >
          Translate
        </button>
      </div>

      <select
        value={targetLanguage}
        onChange={(e) => setTargetLanguage(e.target.value)}
        className="w-full text-xs border border-gray-300 rounded px-2 py-1"
        title="Translation language"
      >
        <option value="Ukrainian">Ukrainian</option>
        <option value="English">English</option>
        <option value="Spanish">Spanish</option>
        <option value="French">French</option>
        <option value="German">German</option>
      </select>

      <div className="text-xs text-gray-500 text-center">
        AI works with entire note content
      </div>
    </div>
  );
};
