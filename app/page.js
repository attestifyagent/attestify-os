export default function Home() {
  return (
    <div style={{ 
      padding: '60px 20px', 
      fontFamily: 'system-ui, -apple-system, sans-serif', 
      maxWidth: '900px', 
      margin: '0 auto',
      backgroundColor: '#ffffff',
      color: '#111',
      lineHeight: '1.6'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ 
          fontSize: '3.5rem', 
          margin: '0 0 16px 0',
          background: 'linear-gradient(90deg, #00b4ff, #00ff9f)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Attestify OS
        </h1>
        <p style={{ fontSize: '1.5rem', color: '#444', maxWidth: '600px', margin: '0 auto' }}>
          Memory-First Full Loop for Production Agents
        </p>
      </div>

      <div style={{ 
        background: '#f8f9fa', 
        padding: '40px', 
        borderRadius: '16px', 
        border: '1px solid #e0e0e0',
        marginBottom: '40px' 
      }}>
        <h2 style={{ marginTop: 0, color: '#111' }}>One API. Full Agent Loop.</h2>
        <ul style={{ fontSize: '1.15rem', lineHeight: '2.1', color: '#222' }}>
          <li>✅ Persistent Memory (Redis-backed)</li>
          <li>✅ Real-time Cost Control</li>
          <li>✅ Secure Execution Sandbox</li>
          <li>✅ Multi-Agent Orchestration</li>
          <li>✅ x402 Payment Enforcement</li>
          <li>✅ Attestify Verification Ready</li>
        </ul>
      </div>

      <h3 style={{ color: '#111' }}>Quick Test</h3>
      <pre style={{ 
        background: '#f4f4f4', 
        padding: '24px', 
        borderRadius: '12px', 
        overflow: 'auto',
        fontSize: '0.95rem',
        border: '1px solid #ddd'
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

      <p style={{ marginTop: '40px', textAlign: 'center', color: '#444' }}>
        <strong>Built for LangGraph • CrewAI • Custom Agents</strong><br />
        Powered by x402 • Base • Redis
      </p>

      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <a href="https://github.com/attestifyagent/attestify-os" 
           style={{ color: '#0066ff', textDecoration: 'none', fontWeight: 'bold', marginRight: '20px' }}>
          → View on GitHub
        </a>
        <a href="https://attestify-full.vercel.app" 
           style={{ color: '#0066ff', textDecoration: 'none', fontWeight: 'bold' }}>
          Attestify Verification →
        </a>
      </div>
    </div>
  );
}
