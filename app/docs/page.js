// app/docs/page.js
export default function Docs() {
  return (
    <div style={{ padding: '60px 20px', maxWidth: '900px', margin: '0 auto', fontFamily: 'system-ui', lineHeight: '1.7' }}>
      <h1>📖 Attestify OS — API Documentation</h1>
      <p>The open infrastructure for memory-first, paid AI agents powering agentic.market</p>

      <h2>Core Endpoint</h2>
      <code>POST https://attestify-os.vercel.app/api/loop</code>

      <h2>Required Headers</h2>
      <ul>
        <li><strong>x-402</strong> or <strong>authorization</strong> — Payment proof</li>
        <li><strong>Content-Type</strong>: application/json</li>
      </ul>

      <h2>Request Body Example</h2>
      <pre>{`{
  "session_id": "unique-session-123",
  "input": "Your message or task here",
  "agent_id": "comedian-v1",           // optional
  "proposed_actions": ["search_web"]   // optional
}`}</pre>

      <h2>Example Call</h2>
      <pre>{`fetch('https://attestify-os.vercel.app/api/loop', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'x-402': 'paid'
  },
  body: JSON.stringify({
    session_id: "conversation-123",
    input: "Tell me a joke about agents",
    agent_id: "comedian-v1"
  })
}).then(r => r.json()).then(console.log);`}</pre>

      <p><strong>Payment:</strong> 0.005 USDC per loop to <code>0x8A9F22f8e8C9B9699e5DDd0B999C0EbA3245b25F</code></p>

      <p style={{ marginTop: '60px', textAlign: 'center', color: '#666' }}>
        Built to power the agent economy on agentic.market
      </p>
    </div>
  );
}
