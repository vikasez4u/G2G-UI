import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { Paperclip } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
const BASEURL=import.meta.env.VITE_BASE_URL

export default function InputBox({ onSend, onStop, isChatStarted, isGenerating,theme }) {
  const [input, setInput] = useState('');
  const [uploadedImageIds, setUploadedImageIds] = useState([]);
  const [uploadCompleted, setUploadCompleted] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [lastFetchedInput, setLastFetchedInput] = useState('');
  const suggestControllerRef = useRef(null);

  const handleSend = useCallback((customInput = null) => {
    const textToSend = (customInput || input).trim();
    if (!textToSend) return;

    if (suggestControllerRef.current) {
      suggestControllerRef.current.abort();
    }

    const sessionId = currentSessionId || uuidv4();
    setCurrentSessionId(sessionId);

    onSend(textToSend, uploadedImageIds, sessionId);
    setInput('');
    setSuggestions([]);
    setUploadedImageIds([]);
    setUploadCompleted(false);
    setLastFetchedInput('');
  }, [input, uploadedImageIds, currentSessionId, onSend]);

  const handleSuggestionClick = useCallback((s) => {
    setInput(s);
    setSuggestions([]);
    handleSend(s);
  }, [handleSend]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(BASEURL+'/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setUploadedImageIds(data.image_ids || []);
      setUploadCompleted(true);
    } catch (err) {
      console.error('❌ Upload error:', err);
    }
  };

  useEffect(() => {
    if (input.trim() === '') {
      setSuggestions([]);
      return;
    }

    const trimmed = input.trim();
    if (trimmed.length < 2 || trimmed === lastFetchedInput) {
      setIsTyping(false);
      return;
    }

    setIsTyping(true);

    const fetchSuggestions = async () => {
      if (suggestControllerRef.current) {
        suggestControllerRef.current.abort();
      }

      const controller = new AbortController();
      suggestControllerRef.current = controller;

      // try {
      //   const res = await fetch(
      //     BASEURL+`/suggest?q=${encodeURIComponent(trimmed)}`,
      //     { signal: controller.signal }
      //   );
      //   const data = await res.json();

      //   if (trimmed !== input.trim()) return;

      //   if (Array.isArray(data)) {
      //     setSuggestions(data.slice(0, 3));
      //     setLastFetchedInput(trimmed);
      //   } else {
      //     setSuggestions([]);
      //   }
      // } catch (err) {
      //   if (err.name !== 'AbortError') {
      //     console.error('❌ Suggestion fetch error:', err);
      //     setSuggestions([]);
      //   }
      // } finally {
      //   setIsTyping(false);
      // }
    };

    // const timeout = setTimeout(fetchSuggestions, 300);
    return () => {
      // clearTimeout(timeout);
      if (suggestControllerRef.current) {
        suggestControllerRef.current.abort();
      }
    };
  }, [input, lastFetchedInput]);

  const previewImages = useMemo(() => (
    uploadedImageIds.map((id) => {
      const url = BASEURL+`/image?image_id=${encodeURIComponent(id)}`;
      return (
        <img
          key={id}
          src={url}
          alt="Uploaded Preview"
          className="w-8 h-8 object-cover rounded"
          onError={(e) => {
            console.error('Image preview error:', e.target.src);
            e.target.style.display = 'none';
          }}
        />
      );
    })
  ), [uploadedImageIds]);

  return (
    <div className={`w-full flex flex-col  ${isChatStarted ? 'mt-auto mb-6' : 'mt-10 mb-5'}`}>
      {isTyping && (
        <div className="px-4 pb-1 text-sm text-gray-500 dark:text-gray-800 animate-pulse">
          Typing...
        </div>
      )}

      {/* {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 px-2 pb-2">
          {suggestions.map((s, i) => (
            <button
              key={`${s}-${i}`}
              onClick={() => handleSuggestionClick(s)}
              className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-sm border border-gray-300 dark:border-gray-500 transition"
            >
              {s}
            </button>
          ))}
        </div>
      )} */}
      
      {suggestions.length > 0 && (
  <div className="flex flex-wrap gap-2 px-2 pb-2">
    {suggestions.map((s, i) => (
      <button
        key={`${s}-${i}`}
        onClick={() => handleSuggestionClick(s)}
        className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-sm text-black dark:text-white border border-gray-300 dark:border-gray-500 transition"
      >
        {s}
      </button>
    ))}
  </div>
)}


      <div className="flex items-center gap-2 border rounded-full shadow-md border-gray-300 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-800">
        <input
          type="text"
          className="flex-1 px-4 py-2 rounded-full focus:outline-none bg-transparent text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          placeholder="Ask your Query..."
          value={input}
          aria-label="Ask a question"
          title="Type your query"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !isGenerating && handleSend()}
          disabled={isGenerating}
        />

        {uploadCompleted ? (
          <div className="flex gap-1">{previewImages}</div>
        ) : (
          <label className="cursor-pointer relative text-gray-600 dark:text-gray-300 hover:text-fuchsia-600">
            <Paperclip className="w-5 h-5" />
            <input
              type="file"
              accept=".docx,.pdf,image/*"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              aria-label="Upload file"
              title="Attach a file"
              disabled={isGenerating}
            />
          </label>
        )}

        {isGenerating ? (
          <button
            onClick={onStop}
            className="px-4 py-2 bg-red-500 text-white rounded-full text-sm"
            title="Stop generating"
          >
            Stop
          </button>
        ) : (
          <button
            onClick={() => handleSend()}
            className="px-4 py-2 bg-fuchsia-700 text-white rounded-full text-sm"
            title="Send message"
          >
            Send
          </button>
        )}
      </div>
    </div>
  );
}
