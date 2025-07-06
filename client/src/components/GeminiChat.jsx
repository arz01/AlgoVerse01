import { useState } from "react";
import "../styles/GeminiChat.css";
import { API_URL } from "../config";

function GeminiChat() {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);

  const toggleChat = () => setOpen(!open);

  const handleSend = async () => {
    if (!prompt.trim()) return;

    const userMessage = { role: "user", text: prompt };
    setMessages((prev) => [...prev, userMessage]);
    setPrompt("");

    try {
      const res = await fetch(`${API_URL}/api/gemini/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      console.log(data);
      const aiMessage = { role: "ai", text: data.reply };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("AI Error:", err);
    }
  };

  return (
    <div>
      <button className="gc-float" onClick={toggleChat}>
        <img src="/assets/gemini-logo.png" alt="Gemini" />
      </button>

      {open && (
        <div className="gc-window">
          <div className="gc-header">
            <strong>Gemini Assistant</strong>
            <span onClick={toggleChat}>✖</span>
          </div>

          <div className="gc-box">
            {messages.map((msg, idx) => (
              <div key={idx} className={`gc-msg ${msg.role}`}>
                {msg.text}
              </div>
            ))}
          </div>

          <div className="gc-input">
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask your doubt..."
            />
            <button onClick={handleSend}>➤</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GeminiChat;