import { useState } from "react";
import "./GeminiChat.css";

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
      const res = await fetch("http://localhost:5000/api/gemini/chat", {
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
      <button className="chat-toggle" onClick={toggleChat}>
        <img src="/assets/gemini-logo.png" alt="Gemini" />
      </button>

      {open && (
        <div className="chat-box">
          <div className="chat-header">
            <strong>Gemini Assistant</strong>
            <button onClick={toggleChat}>✖</button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-msg ${msg.role}`}>
                {msg.text}
              </div>
            ))}
          </div>

          <div className="chat-input">
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
