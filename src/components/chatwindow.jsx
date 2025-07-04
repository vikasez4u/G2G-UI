import React, { useEffect, useRef, useState } from 'react';

export default function ChatWindow({ messages, isSidebarOpen, onSend, onStop, isGenerating, setSuggestions, theme }) {
  const bottomRef = useRef(null);
  const [feedbackGiven, setFeedbackGiven] = useState({});
  const [currentlyEditingIndex, setCurrentlyEditingIndex] = useState(null);
  const [editedInput, setEditedInput] = useState('');
  const [copySuccessIdx, setCopySuccessIdx] = useState(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const lastUserMessage = messages.filter(m => m.sender === 'user').at(-1)?.text || '';
    const lastBotMessage = messages.filter(m => m.sender === 'bot').at(-1);

    if (!isGenerating && lastUserMessage && lastBotMessage) {
      fetch(`http://localhost:8000/suggest?q=${encodeURIComponent(lastUserMessage)}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setSuggestions(data);
        })
        .catch((err) => {
          console.error("❌ Suggestion fetch error:", err);
          setSuggestions([]);
        });
    }
  }, [isGenerating, messages]);

  const handleFeedback = async (idx, question, response, feedbackType) => {
    const sessionId = localStorage.getItem('session_id') || crypto.randomUUID();
    localStorage.setItem('session_id', sessionId);
    setFeedbackGiven(prev => ({ ...prev, [idx]: feedbackType }));

    try {
      await fetch('http://localhost:8000/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, response, feedback: feedbackType, session_id: sessionId }),
      });
    } catch (err) {
      console.error('Error sending feedback:', err);
    }
  };

  const copyToClipboard = async (text, idx) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccessIdx(idx);
      setTimeout(() => setCopySuccessIdx(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleEditSave = (idx) => {
    if (editedInput.trim()) {
      onSend(editedInput.trim());
    }
    setCurrentlyEditingIndex(null);
    setEditedInput('');
  };

  const isDark = theme === 'dark';

  return (
    <div
      className={`flex-1 overflow-y-auto p-4 space-y-2 pt-20 transition-all duration-300 ${
        isSidebarOpen ? 'ml-1' : 'ml-0'
      } ${isDark ? 'bg-zinc-900 text-zinc-100' : 'bg-white text-black'}`}
    >
      {messages.map((msg, idx) => {
        const isBot = msg.sender === 'bot';
        const isLoading = msg.loading;
        const prevUserMsg = messages[idx - 1]?.sender === 'user' ? messages[idx - 1].text : '';

        return (
          <div
            key={idx}
            className={`flex mb-10 ${msg.sender === 'user' ? 'justify-end mr-4' : 'justify-start ml-4'}`}
          >
            <div
              className={`group relative px-4 py-2 rounded-lg max-w-md break-words shadow ${
                msg.sender === 'user'
                  ? isDark
                    ? 'bg-zinc-300 text-black'
                    : 'bg-fuchsia-500 text-white'
                  : isDark
                  ? 'bg-zinc-700 text-zinc-100'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1">
                  {isLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <div className="animate-pulse">Generating your response...</div>
                    </span>
                  ) : currentlyEditingIndex === idx ? (
                    <input
                      autoFocus
                      value={editedInput}
                      onChange={(e) => setEditedInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleEditSave(idx);
                      }}
                      className="w-full px-2 py-1 rounded border outline-none bg-white text-black"
                    />
                  ) : isBot ? (
                    <ul className="list-disc pl-2 space-y-1">
                      {msg.text
                        .split('\n')
                        .filter(line => line.trim().startsWith('-'))
                        .map((line, i) => (
                          <li key={i}>{line.replace(/^-+/, '').trim()}</li>
                        ))}
                      {msg.text
                        .split('\n')
                        .filter(line => !line.trim().startsWith('-') && line.trim() !== '')
                        .map((line, i) => (
                          <p key={`p-${i}`}>{line.trim()}</p>
                        ))}
                    </ul>
                  ) : (
                    <span>{msg.text}</span>
                  )}
                </div>

                {!isBot && !isLoading && currentlyEditingIndex !== idx && (
                  <div className={`hidden group-hover:flex gap-2 ml-2 text-xs ${isDark ? 'text-white' : 'text-gray-600'}`}>
                    <button
                      onClick={() => copyToClipboard(msg.text, idx)}
                      className="underline hover:text-gray-400"
                    >
                      Copy
                    </button>
                    <button
                      onClick={() => {
                        setCurrentlyEditingIndex(idx);
                        setEditedInput(msg.text);
                      }}
                      className="underline hover:text-gray-400"
                    >
                      Edit
                    </button>
                  </div>
                )}

                {currentlyEditingIndex === idx && (
                  <div className={`flex gap-2 ml-2 text-xs ${isDark ? 'text-white' : 'text-gray-600'}`}>
                    <button
                      onClick={() => handleEditSave(idx)}
                      className="underline hover:text-green-400"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setCurrentlyEditingIndex(null);
                        setEditedInput('');
                      }}
                      className="underline hover:text-red-400"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {copySuccessIdx === idx && (
                <div className="mt-1 text-xs text-green-400">Copied!</div>
              )}

              {msg.image_ids?.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {msg.image_ids.map((id) => {
                    const url = `http://localhost:8000/image?image_id=${encodeURIComponent(id)}`;
                    return (
                      <img
                        key={id}
                        src={url}
                        alt="Related"
                        className="w-36 h-40 object-cover rounded border"
                        onError={(e) => {
                          console.error('❌ Failed to load image:', e.target.src);
                          e.target.style.display = 'none';
                        }}
                      />
                    );
                  })}
                </div>
              )}

              {msg.related_links?.length > 0 && (
                <div className="mt-2 flex flex-col gap-1 text-sm">
                  <span className={`${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>Related Links:</span>
                  {msg.related_links.map((link, i) => (
                    <a
                      key={i}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-blue-500 break-all hover:text-blue-700"
                    >
                      {link}
                    </a>
                  ))}
                </div>
              )}

              {isBot && !isLoading && !feedbackGiven[idx] && (
                <div className="mt-5 flex gap-3 text-sm text-gray-500">
                  How was the response?
                  <button
                    onClick={() => handleFeedback(idx, prevUserMsg, msg.text, 'up')}
                    className="hover:text-green-600 text-2xl"
                    title="Helpful"
                  >
                    👍
                  </button>
                  <button
                    onClick={() => handleFeedback(idx, prevUserMsg, msg.text, 'down')}
                    className="hover:text-red-600 text-2xl"
                    title="Not Helpful"
                  >
                    👎
                  </button>
                </div>
              )}

              {feedbackGiven[idx] && (
                <div className="mt-1 text-sm italic text-gray-400">
                  You marked this as {feedbackGiven[idx] === 'up' ? '👍 Helpful' : '👎 Not Helpful'}.
                </div>
              )}
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
