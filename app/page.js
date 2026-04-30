export default function Home() {
  return (
    <div style={{ 
      padding: '60px 20px', 
      fontFamily: 'system-ui, -apple-system, sans-serif', 
      maxWidth: '900px', 
      margin: '0 auto',
      lineHeight: '1.6'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ fontSize: '3.5rem', margin: '0 0 16px 0', background: 'linear-gradient(90deg, #00ff9f, #00b4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Attestify OS
        </h1>
        <p style={{ fontSize: '1.5rem', color: '#888', maxWidth: '600px', margin: '0 auto' }}>
          Memory-First Full Loop for Production Agents
        </p>
      </div>

      <div style={{ background: '#111', padding: '40px', borderRadius: '16px', marginBottom: '40px' }}>
        <h2 style={{ marginTop: 0 }}>One API. Full Agent Loop.</h2>
        <ul style={{ fontSize: '1.1rem', lineHeight: '2' }}>
          <li>✅ Persistent Memory (Redis-backed)</li>
          <li>✅ Real-time Cost Control</li>
          <li>✅ Secure Execution Sandbox</li>
          <li>✅ Multi-Agent Orchestration</li>
          <li>✅ x402 Payment Enforcement</li>
          <li>✅ Attestify Verification Ready</li>
        </ul>
      </div>

      <h3>Quick Test</h3>
      <pre style={{ 
        background: '#0a0a0a', 
        padding: '20px', 
        borderRadius: '12px', 
        overflow: 'auto',
        fontSize: '0.95rem'
      }}>
{`fetch('https://attestify-os.vercel.app/api/loop', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    session_id: "your-agent-id",
    input: "Your query or instruction here..."
  })
}).then(r => r.json()).then(console.log);`}
      </pre>

      <p style={{ marginTop: '40px', textAlign: 'center' }}>
        <strong>Built for LangGraph • CrewAI • Custom Agents</strong><br />
        Powered by x402 • Base • Vercel KV
      </p>

      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <a href="https://github.com/attestifyagent/attestify-os" 
           style={{ color: '#00ff9f', textDecoration: 'none', fontWeight: 'bold' }}>
          → View on GitHub
        </a>
        {" | "}
        <a href="https://attestify-full.vercel.app" 
           style={{ color: '#00ff9f', textDecoration: 'none', fontWeight: 'bold' }}>
          Attestify Verification →
        </a>
      </div>
    </div>
  );
}
