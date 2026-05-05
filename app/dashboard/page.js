// app/dashboard/page.js
'use client';

export default function Dashboard() {
  const [history, setHistory] = React.useState([]);

  const runLoop = async (input) => {
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
  };

  return (
    <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
      <h1>🛒 agentic.market Control Panel</h1>
      
      <button onClick={() => runLoop("Tell me a joke about agents")} style={{ padding: '12px 24px', margin: '10px' }}>
        Test Loop
      </button>

      <div style={{ marginTop: '30px' }}>
        {history.map((h, i) => (
          <div key={i} style={{ border: '1px solid #ddd', padding: '15px', margin: '10px 0', borderRadius: '8px' }}>
            <strong>You:</strong> {h.input}<br />
            <strong>Agent:</strong> {h.output}
          </div>
        ))}
      </div>
    </div>
  );
}
