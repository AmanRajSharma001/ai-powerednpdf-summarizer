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

  return (
    <div className="landing-page">
      <SideBar />
      <MainPage file = {file} setFile = {setFile} message = {message} setMessage = {setMessage} question = {question} setQuestion = {setQuestion} answer = {answer} setAnswer = {setAnswer} loading = {loading} setLoading = {setLoading} error = {error} setError = {setError}/>
    </div>
  );
}

export default App;

//important:

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