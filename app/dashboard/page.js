// app/dashboard/page.js
'use client';

export default function Dashboard() {
  const runTest = async () => {
    const res = await fetch('/api/loop', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-402': 'paid'
      },
      body: JSON.stringify({
        session_id: "dashboard-test-" + Date.now(),
        input: "Tell me why agentic.market will win the agent economy",
        agent_id: "comedian-v1"
      })
    });
    const data = await res.json();
    console.log(data);
    alert("Loop executed! Check console for details.");
  };

  return (
    <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto', fontFamily: 'system-ui' }}>
      <h1>🛒 agentic.market Bazaar</h1>
      <p>The Infrastructure Layer for Paid, Memory-First Agents</p>

      <button 
        onClick={runTest}
        style={{ padding: '16px 32px', fontSize: '18px', margin: '20px 0', background: '#000', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
      >
        Test Loop Now
      </button>

      <div style={{ marginTop: '40px' }}>
        <h2>Features Live</h2>
        <ul>
          <li>✅ Persistent Memory</li>
          <li>✅ Real Grok LLM</li>
          <li>✅ x402 Payment Ready</li>
          <li>✅ Agent Registration & Discovery</li>
          <li>✅ Tool Action Simulation</li>
        </ul>
      </div>
    </div>
  );
}
