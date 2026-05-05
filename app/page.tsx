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
      <h1 style={{ fontSize: '52px', marginBottom: '16px' }}>
        ⚙️ Attestify OS
      </h1>
      <p style={{ fontSize: '28px', color: '#444', marginBottom: '40px' }}>
        Memory-First Infrastructure for agentic.market
      </p>
      <p style={{ fontSize: '20px', color: '#666', maxWidth: '600px', margin: '0 auto 60px' }}>
        Persistent memory • Real Grok intelligence • x402 micropayments • Production-ready agent loops
      </p>

      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
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

      <p style={{ marginTop: '80px', color: '#666' }}>
        The open infrastructure layer powering <strong>agentic.market</strong>
      </p>
    </div>
  );
}
