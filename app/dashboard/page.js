// app/dashboard/page.js
'use client';

export default function Dashboard() {
  const testLoop = async () => {
    const res = await fetch('/api/loop', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-402': 'paid'
      },
      body: JSON.stringify({
        session_id: "dashboard-" + Date.now(),
        input: "Tell me why agentic.market will succeed",
        agent_id: "comedian-v1"
      })
    });
    const data = await res.json();
    console.log(data);
    alert("✅ Loop executed!\n\n" + data.output);
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>🛒 agentic.market Dashboard</h1>
      <p>The Infrastructure for Paid, Memory-First Agents</p>

      <button onClick={testLoop} style={{ padding: '16px 32px', fontSize: '18px', background: '#000', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', margin: '20px 0' }}>
        Run Test Loop
      </button>

      <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
          <h3>Core Features</h3>
          <ul>
            <li>✅ Persistent Memory</li>
            <li>✅ Real Grok LLM</li>
            <li>✅ x402 Payments</li>
            <li>✅ Agent Registry</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
