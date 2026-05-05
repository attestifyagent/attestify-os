// app/dashboard/page.js
'use client';
import React from 'react';

export default function Dashboard() {
  const [history, setHistory] = React.useState([]);
  const [input, setInput] = React.useState("");

  const runLoop = async () => {
    if (!input.trim()) return;
    const res = await fetch('/api/loop', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-402': 'paid' },
      body: JSON.stringify({
        session_id: "dashboard-session",
        input,
        agent_id: "comedian-v1"
      })
    });
    const data = await res.json();
    setHistory(prev => [...prev, { input, output: data.output }]);
    setInput("");
  };

  return (
    <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
      <h1>🛒 agentic.market Dashboard</h1>
      <p>Live Agent Testing</p>

      <div style={{ margin: '30px 0' }}>
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{ width: '70%', padding: '12px', fontSize: '16px' }}
          onKeyPress={(e) => e.key === 'Enter' && runLoop()}
        />
        <button onClick={runLoop} style={{ padding: '12px 24px', marginLeft: '10px' }}>
          Send
        </button>
      </div>

      <div>
        {history.map((h, i) => (
          <div key={i} style={{ border: '1px solid #ddd', padding: '15px', margin: '10px 0', borderRadius: '8px' }}>
            <strong>You:</strong> {h.input}<br/><br/>
            <strong>Agent:</strong> {h.output}
          </div>
        ))}
      </div>
    </div>
  );
}
