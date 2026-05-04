// app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ 
      padding: '80px 20px', 
      textAlign: 'center', 
      maxWidth: '900px', 
      margin: '0 auto',
      lineHeight: '1.6'
    }}>
      <h1 style={{ fontSize: '52px', marginBottom: '16px' }}>
        🛒 agentic.market
      </h1>
      <p style={{ fontSize: '28px', color: '#444', marginBottom: '40px' }}>
        The Bazaar for Memory-First AI Agents
      </p>

      <div style={{ marginBottom: '50px' }}>
        <Link 
          href="/dashboard"
          style={{
            padding: '18px 36px',
            background: '#000',
            color: '#fff',
            fontSize: '18px',
            borderRadius: '12px',
            textDecoration: 'none',
            display: 'inline-block'
          }}
        >
          Open Dashboard →
        </Link>
      </div>

      <div style={{ fontSize: '18px', color: '#555' }}>
        <p><strong>Core Features Live:</strong></p>
        <p>• Persistent Redis Memory<br />
           • Real Grok LLM<br />
           • x402 Payment Ready<br />
           • Agent Registration & Discovery<br />
           • Tool Action Simulation</p>
      </div>
    </div>
  );
}
