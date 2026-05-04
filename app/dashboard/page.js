// app/dashboard/page.js
'use client';

export default function Dashboard() {
  const testLoop = () => {
    fetch('/api/loop', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-402': 'paid' },
      body: JSON.stringify({
        session_id: "test-" + Date.now(),
        input: "Tell me something inspiring about building agent marketplaces",
        agent_id: "comedian-v1"
      })
    })
    .then(r => r.json())
    .then(console.log);
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui' }}>
      <h1>🚀 agentic.market Dashboard</h1>
      <p>Core Loop + Agent System Ready</p>
      
      <button onClick={testLoop} style={{ padding: '12px 24px', fontSize: '16px' }}>
        Test Loop Now
      </button>

      <p style={{ marginTop: '30px' }}>
        <strong>Current Features:</strong><br />
        • Persistent Memory<br />
        • Real Grok LLM<br />
        • x402 Payment Ready<br />
        • Agent Registration<br />
        • Tool Simulation<br />
        • Multi-Agent Handoff
      </p>
    </div>
  );
}
