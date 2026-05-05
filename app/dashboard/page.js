// app/dashboard/page.js
'use client';
import React from 'react';

export default function Dashboard() {
  const [history, setHistory] = React.useState([]);
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    const userMessage = input;
    setInput("");

    // Add user message immediately
    setHistory(prev => [...prev, { role: "user", content: userMessage }]);

    try {
      const res = await fetch('/api/loop', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'x-402': 'paid' 
        },
        body: JSON.stringify({
          session_id: "dashboard-session",
          input: userMessage,
          agent_id: "comedian-v1"
        })
      });

      const data = await res.json();
      
      setHistory(prev => [...prev, { 
        role: "assistant", 
        content: data.output 
      }]);
    } catch (error) {
      setHistory(prev => [...prev, { 
        role: "assistant", 
        content: "Sorry, something went wrong. Please try again." 
      }]);
    }

    setIsLoading(false);
  };

  return (
    <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <h1>⚙️ Attestify OS — Dashboard</h1>
      <p>Live testing ground for memory-first agents</p>

      <div style={{ margin: '30px 0' }}>
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message to the agent..."
          style={{ 
            width: '75%', 
            padding: '14px', 
            fontSize: '16px', 
            borderRadius: '8px', 
            border: '1px solid #ccc' 
          }}
          disabled={isLoading}
        />
        <button 
          onClick={sendMessage} 
          disabled={isLoading || !input.trim()}
          style={{ 
            padding: '14px 28px', 
            marginLeft: '10px', 
            background: '#000', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '8px', 
            fontSize: '16px',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? "Thinking..." : "Send"}
        </button>
      </div>

      <div style={{ marginTop: '30px' }}>
        {history.length === 0 && (
          <p style={{ color: '#888', textAlign: 'center' }}>Send a message to start chatting with an agent.</p>
        )}
        
        {history.map((msg, index) => (
          <div 
            key={index} 
            style={{ 
              margin: '15px 0', 
              padding: '18px', 
              borderRadius: '12px',
              background: msg.role === 'user' ? '#f0f0f0' : '#e6f7ff',
              textAlign: msg.role === 'user' ? 'right' : 'left',
              maxWidth: '85%'
            }}
          >
            <strong>{msg.role === 'user' ? 'You' : 'Agent'}:</strong><br />
            {msg.content}
          </div>
        ))}
      </div>
    </div>
  );
}
