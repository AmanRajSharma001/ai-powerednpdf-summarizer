import React, { useState, useEffect, useRef } from 'react'

function Queries({ file, setFile, message, setMessage, question, setQuestion, answer, setAnswer, loading, setLoading, error, setError }) {
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState("");
  const [isUploaded, setIsUploaded] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 200) + 'px';
    }
  }, [query]);

  const uploadPDF = async () => {
    if (!file) {
      alert("Please select a PDF first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    setMessage("Uploading…");

    try {
      const response = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Uploaded successfully");
        setIsUploaded(true);
        setUploadedFileName(file.name);
      } else {
        setMessage("Upload failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Upload failed. Server may be offline.");
    }
  };

  const handleSend = async () => {
    const trimmed = query.trim();
    if (!trimmed || isSending) return;

    const userMsg = { id: Date.now(), sender: "user", text: trimmed };
    setMessages(prev => [...prev, userMsg]);
    setQuery("");
    setIsSending(true);
    setIsTyping(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed }),
      });

      let aiText = "The AI service is currently unavailable. Please try again later.";

      if (response.ok) {
        const data = await response.json();
        if (data.answer) {
          aiText = data.answer;
        }
      } else if (response.status === 503) {
        aiText = "The AI service is currently unavailable. Please try again later.";
      }

      const aiMsg = { id: Date.now() + 1, sender: "assistant", text: aiText };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      const errMsg = {
        id: Date.now() + 1,
        sender: "assistant",
        text: "The AI service is currently unavailable. Please try again later.",
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="queries">

      {isUploaded && (
        <div className="pdf-card">
          <div className="pdf-card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          </div>
          <div className="pdf-card-info">
            <span className="pdf-card-name">{uploadedFileName}</span>
            <span className="pdf-card-status">✓ Uploaded successfully</span>
          </div>
        </div>
      )}

      <div className="query-messages">

        {messages.length === 0 && !isTyping && (
          <div className="welcome-screen">
            <div className="welcome-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/>
              </svg>
            </div>
            <h2 className="welcome-title">DocIntel AI</h2>
            <p className="welcome-subtitle">
              {isUploaded
                ? `"${uploadedFileName}" is ready. Ask me anything about it.`
                : "Upload a PDF to get started. Ask questions, extract insights, and chat with your document."}
            </p>
            {!isUploaded && (
              <div className="welcome-upload-area">
                <label htmlFor="file-welcome" className="welcome-upload-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                  </svg>
                  {file ? file.name : "Choose PDF"}
                </label>
                <input
                  id="file-welcome"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files[0])}
                  hidden
                />
                {file && (
                  <button className="welcome-send-btn" onClick={uploadPDF}>
                    Upload PDF
                  </button>
                )}
                {message && <p className="welcome-upload-msg">{message}</p>}
              </div>
            )}
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message-wrapper ${msg.sender === 'user' ? 'user-wrapper' : 'assistant-wrapper'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="avatar assistant-avatar">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2M9 14a1 1 0 1 0 0 2 1 1 0 0 0 0-2m6 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/>
                </svg>
              </div>
            )}
            <div className={`message-bubble ${msg.sender}`}>
              {msg.text}
            </div>
            {msg.sender === 'user' && (
              <div className="avatar user-avatar">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="message-wrapper assistant-wrapper">
            <div className="avatar assistant-avatar">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2M9 14a1 1 0 1 0 0 2 1 1 0 0 0 0-2m6 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/>
              </svg>
            </div>
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="query-input">
        {file && !isUploaded && (
          <div className="selected-file-preview">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            <span className="file-name">{file.name}</span>
            <button className="upload-btn" onClick={uploadPDF}>Upload PDF</button>
            {message && <span className="upload-message">{message}</span>}
          </div>
        )}

        <div className="input-container">
          <label htmlFor="file-input" className="attach-btn" title="Attach PDF">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
            </svg>
          </label>
          <input
            id="file-input"
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
            hidden
          />

          <textarea
            ref={textareaRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isUploaded ? "Ask a question about your PDF…" : "Upload a PDF first, then ask questions…"}
            rows={1}
            disabled={isSending}
          />

          <button
            className="send-btn"
            onClick={handleSend}
            disabled={!query.trim() || isSending}
            title="Send message"
          >
            {isSending ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="spin">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            )}
          </button>
        </div>

        <p className="input-hint">Press Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  );
}

export default Queries
