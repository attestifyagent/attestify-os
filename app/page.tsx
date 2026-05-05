// app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ 
      padding: '80px 20px', 
      textAlign: 'center', 
      maxWidth: '1000px', 
      margin: '0 auto',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1 style={{ fontSize: '56px', marginBottom: '16px' }}>
        🛒 agentic.market
      </h1>
      <p style={{ fontSize: '28px', color: '#444', marginBottom: '40px' }}>
        The Bazaar for Memory-First AI Agents
      </p>
      <p style={{ fontSize: '20px', color: '#666', maxWidth: '600px', margin: '0 auto 60px' }}>
        Persistent memory • Real Grok intelligence • x402 micropayments • Production-ready agent loops
      </p>

      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '80px' }}>
        <Link 
          href="/dashboard"
          style={{
            padding: '18px 36px',
            background: '#000',
            color: '#fff',
            fontSize: '18px',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}
        >
          Open Dashboard →
        </Link>

        <Link 
          href="/bazaar"
          style={{
            padding: '18px 36px',
            background: '#fff',
            color: '#000',
            fontSize: '18px',
            border: '2px solid #000',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}
        >
          Browse Bazaar
        </Link>
      </div>

      <div style={{ textAlign: 'left', maxWidth: '700px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>What’s Live</h2>
        <ul style={{ fontSize: '18px', lineHeight: '2' }}>
          <li>✅ Persistent Redis Memory</li>
          <li>✅ Real Grok LLM (with long context)</li>
          <li>✅ x402 Payment Enforcement</li>
          <li>✅ Agent Registry + Auto-loading</li>
          <li>✅ Tool Action Simulation</li>
          <li>✅ Multi-turn Memory</li>
        </ul>
      </div>

      <p style={{ marginTop: '60px', color: '#888' }}>
        Built as the infrastructure layer for the agent economy
      </p>
    </div>
  );
}
