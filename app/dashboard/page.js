// app/dashboard/page.js
'use client';
import React from 'react';

export default function Dashboard() {
  const [history, setHistory] = React.useState([]);
  const [input, setInput] = React.useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;
    const res = await fetch('/api/loop', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-402': 'paid' },
      body: JSON.stringify({
        session_id: "dashboard-" + Date.now(),
        input,
        agent_id: "comedian-v1"
      })
    });
    const data = await res.json();
    setHistory(prev => [...prev, { role: "user", content: input }, { role: "assistant", content: data.output }]);
    setInput("");
  };

  return (
    <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
      <h1>⚙️ Attestify OS — Dashboard</h1>
      <p>Testing Ground for Memory-First Agents</p>

      <div style={{ margin: '30px 0' }}>
        <input 
          value={input} 
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message to the agent..."
          style={{ width: '70%', padding: '12px', fontSize: '16px' }}
        />
        <button onClick={sendMessage} style={{ padding: '12px 24px', marginLeft: '10px' }}>
          Send
        </button>
      </div>

      <div>
        {history.map((msg, i) => (
          <div key={i} style={{ 
            margin: '15px 0', 
            padding: '15px', 
            borderRadius: '8px',
            background: msg.role === 'user' ? '#f0f0f0' : '#e6f7ff',
            textAlign: msg.role === 'user' ? 'right' : 'left'
          }}>
            <strong>{msg.role === 'user' ? 'You' : 'Agent'}:</strong> {msg.content}
          </div>
        ))}
      </div>
    </div>
  );
}
