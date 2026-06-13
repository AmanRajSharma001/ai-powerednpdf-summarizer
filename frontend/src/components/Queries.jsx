import React from 'react'

function Queries({file,setFile,message,setMessage,question,setQuestion,answer,setAnswer,loading,setLoading,error,setError}) {
  const uploadPDF = async () => {
    if (!file) {
      alert("Please select a PDF");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      setMessage(data.message);
      console.log(data);
    } catch (error) {
      console.error(error);
      setMessage("Upload failed");
    }
  };

  const askQuestion = async () => {
    if (!question.trim()) {
      alert("Please enter a question");
      return;
    }

    setLoading(true);
    setError("");
    setAnswer("");

    try {
      const response = await fetch("http://127.0.0.1:8000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAnswer(data.answer || "No answer returned.");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to fetch answer");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className='queries'>
      <div className='query-messages'>
        
      </div>
      <div className='query-input'>
        <div className="qa-section" style={{ margin: "20px 0" }}>
            <h2>Ask a Question</h2>
            <input 
              type="text" 
              placeholder="Enter your question here..." 
              value={question} 
              onChange={(e) => setQuestion(e.target.value)}
              style={{ width: "300px", padding: "8px", marginRight: "10px" }}
            />
            <button onClick={askQuestion} disabled={loading}>
              {loading ? "Asking..." : "Ask"}
            </button>
              {loading && <p>Loading answer...</p>}
              {error && <p style={{ color: "red" }}>Error: {error}</p>}
              {answer && (
              <div style={{ marginTop: "15px", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
                <strong>Answer:</strong>
                <p>{answer}</p>
              </div>
            )}
          <div className="upload-section" style={{ margin: "20px 0" }}>
              <label for = "file">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-paperclip-icon lucide-paperclip"><path d="m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551"/></svg>
                Attach file
              </label>
              <input id = "file" type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} hidden/>
              <button className="upload-btn" onClick={uploadPDF}>Upload PDF</button>
              <p>{message}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Queries
