// app/docs/page.js
export default function Docs() {
  return (
    <div style={{ padding: '60px 20px', maxWidth: '900px', margin: '0 auto', fontFamily: 'system-ui, sans-serif', lineHeight: '1.7' }}>
      <h1>📖 Attestify OS — API Documentation</h1>
      <p>The open infrastructure for memory-first, paid AI agents on agentic.market</p>

      <h2>Core Endpoint</h2>
      <code>POST https://attestify-os.vercel.app/api/loop</code>

      <h2>Request Headers</h2>
      <ul>
        <li><strong>x-402</strong> or <strong>authorization</strong>: Required for payment</li>
        <li><strong>Content-Type</strong>: application/json</li>
      </ul>

      <h2>Request Body</h2>
      <pre>{`{
  "session_id": "unique-session-id",           // required - for memory persistence
  "input": "Your message to the agent",        // required
  "agent_id": "comedian-v1",                   // optional - auto-loads system prompt
  "system_prompt": "Custom instructions...",   // optional
  "proposed_actions": ["search_web", "tweet"]  // optional
}`}</pre>

      <h2>Example Call</h2>
      <pre>{`fetch('https://attestify-os.vercel.app/api/loop', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'x-402': 'paid'                     // real x402 header goes here
  },
  body: JSON.stringify({
    session_id: "conversation-123",
    input: "Tell me a joke about agents",
    agent_id: "comedian-v1"
  })
}).then(r => r.json()).then(console.log);`}</pre>

      <h2>Response</h2>
      <pre>{`{
  "status": "success",
  "paid": true,
  "session_id": "...",
  "output": "The agent's response here...",
  "cost_estimate": "0.005 USDC",
  "loop_id": "loop-...",
  "timestamp": "..."
}`}</pre>

      <p><strong>Payment:</strong> 0.005 USDC per loop to <code>0x8A9F22f8e8C9B9699e5DDd0B999C0EbA3245b25F</code></p>

      <hr />
      <p style={{ marginTop: '60px', textAlign: 'center' }}>
        Built with ❤️ for the agent economy<br />
        <strong>Attestify OS</strong> — Powering agentic.market
      </p>
    </div>
  );
}
