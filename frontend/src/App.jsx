import { useState } from "react";
import "./App.css";
import SideBar from "./components/SideBar"
import MainPage from "./components/MainPage"
function App() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    <div className="landing-page">
      <SideBar />
      <MainPage />
    </div>
  );
}

export default App;

      // <h1>AI Powered PDF Summarizer</h1>
      
      // <div className="upload-section" style={{ margin: "20px 0" }}>
      //   <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])}/>
      //   <button className="upload-btn" onClick={uploadPDF}>Upload PDF</button>
      //   <p>{message}</p>
      // </div>

      // <hr />

      // <div className="qa-section" style={{ margin: "20px 0" }}>
      //   <h2>Ask a Question</h2>
      //   <input 
      //     type="text" 
      //     placeholder="Enter your question here..." 
      //     value={question} 
      //     onChange={(e) => setQuestion(e.target.value)}
      //     style={{ width: "300px", padding: "8px", marginRight: "10px" }}
      //   />
      //   <button onClick={askQuestion} disabled={loading}>
      //     {loading ? "Asking..." : "Ask"}
      //   </button>

      //   {loading && <p>Loading answer...</p>}
      //   {error && <p style={{ color: "red" }}>Error: {error}</p>}
      //   {answer && (
      //     <div style={{ marginTop: "15px", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
      //       <strong>Answer:</strong>
      //       <p>{answer}</p>
      //     </div>
      //   )}
      // </div>