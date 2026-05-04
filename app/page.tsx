import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'system-ui, sans-serif', 
      maxWidth: '800px', 
      margin: '0 auto' 
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>
        Attestify OS
      </h1>
      <p style={{ fontSize: '1.4rem', color: '#666', marginBottom: '40px' }}>
        Unified x402 Agent Operating System
      </p>

      <div style={{ background: '#111', padding: '30px', borderRadius: '12px', marginBottom: '30px' }}>
        <h2>Memory-First Full Loop</h2>
        <p>One call handles:</p>
        <ul>
          <li>✅ Persistent Memory</li>
          <li>✅ Real-time Cost Control</li>
          <li>✅ Secure Sandbox</li>
          <li>✅ Multi-Agent Orchestration</li>
          <li>✅ Attestify Verification</li>
        </ul>
      </div>

      <h3>Quick Test</h3>
      <pre style={{ background: '#000', padding: '20px', borderRadius: '8px', overflow: 'auto' }}>
{`fetch('https://attestify-os.vercel.app/api/loop', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    session_id: "agent-123",
    input: "Your query here..."
  })
}).then(r => r.json()).then(console.log);`}
      </pre>

      <p style={{ marginTop: '30px' }}>
        <strong>Built for production agents.</strong><br />
        Powered by x402 • Base • Vercel
      </p>

      <p>
        <Link href="/api/loop" style={{ color: '#00ff9f' }}>
          → Test the API directly
        </Link>
      </p>
    </div>
  );
}
