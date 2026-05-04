// app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ padding: '60px 20px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '48px' }}>🛒 agentic.market</h1>
      <p style={{ fontSize: '24px', margin: '20px 0' }}>
        The Bazaar for Memory-First AI Agents
      </p>
      <p style={{ fontSize: '18px', color: '#666' }}>
        Persistent memory • Real micropayments (x402) • Production-ready agent loops
      </p>

      <div style={{ margin: '40px 0' }}>
        <a href="/dashboard" 
           style={{ padding: '16px 32px', background: '#000', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '18px' }}>
          Open Dashboard →
        </a>
      </div>

      <p><strong>API Ready:</strong> <code>/api/loop</code> • <code>/api/agents</code></p>
    </div>
  );
}
