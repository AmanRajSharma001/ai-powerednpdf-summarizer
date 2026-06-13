import { useState } from "react"
function Nav_bar() {
    const [activeBtn,setActiveBtn] = useState(null);
    const [signupActive,setSignupActive] = useState(null);
    return (
        <div className="navbar">
            <div className="navbar-left">
                <div className="navbar-header">
                    <h1>DocIntel AI</h1>
                    <p>AI Assistant: Nova</p>
                </div>
                <div className='navbar-options-1'>
                    <button className={`navbar-btn ${activeBtn == 1 ? "active" : ""}`} onClick={()=>{setActiveBtn(1),setSignupActive(null)}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 64 64"><path d="M14 4h24l12 12v40a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4z" fill="#ffffff" stroke="#d1d5db" strokeWidth="2"/><path d="M38 4v12h12" fill="#f3f4f6"/><rect x="8" y="38" width="48" height="16" rx="3" fill="#e53935"/><text x="32" y="50" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="Arial">PDF</text></svg>
                        Uploaded pdf
                    </button>
                </div>
            </div>
            <div className="navbar-options-right">
                <div className="navbar-options-2">
                    <button className={`navbar-btn ${activeBtn == 1 ? "active" : ""}`} onClick={()=>{setActiveBtn(1),setSignupActive(null)}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51 15.42 17.49"/><path d="M15.41 6.51 8.59 10.49"/></svg>
                        Share
                    </button>
                </div>
                <div className="navbar-options-3">
                    <button className={`navbar-btn ${activeBtn == 1 ? "active" : ""}`} onClick={()=>{setActiveBtn(1),setSignupActive(null)}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
                    </button>
                </div>
            </div>
        </div>
  );
}

export default Nav_bar;

