// app/dashboard/page.js
'use client';
import React from 'react';

export default function Dashboard() {
  const [history, setHistory] = React.useState([]);

  const runLoop = async (input) => {
    const res = await fetch('/api/loop', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'x-402': 'paid' 
      },
      body: JSON.stringify({
        session_id: "dashboard-" + Date.now(),
        input,
        agent_id: "comedian-v1"
      })
    });
    const data = await res.json();
    setHistory(prev => [...prev, { input, output: data.output }]);
    console.log(data);
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <h1>🛒 agentic.market Dashboard</h1>
      <p>Memory-First Agent Testing Ground</p>

      <div style={{ margin: '30px 0' }}>
        <button 
          onClick={() => runLoop("Tell me a joke about AI agents")}
          style={{ padding: '14px 28px', fontSize: '17px', marginRight: '10px', background: '#000', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
        >
          Run Joke Test
        </button>

        <button 
          onClick={() => runLoop("What is the future of agent marketplaces?")}
          style={{ padding: '14px 28px', fontSize: '17px', background: '#000', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
        >
          Run Research Test
        </button>
      </div>

      <div style={{ marginTop: '40px' }}>
        {history.map((item, index) => (
          <div key={index} style={{ 
            border: '1px solid #ddd', 
            padding: '20px', 
            margin: '15px 0', 
            borderRadius: '10px',
            background: '#f9f9f9'
          }}>
            <strong>You:</strong> {item.input}<br /><br />
            <strong>Agent:</strong> {item.output}
          </div>
        ))}
      </div>
    </div>
  );
}
