// app/bazaar/page.js
export default function Bazaar() {
  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>🛍️ agentic.market Bazaar</h1>
      <p>Browse and run production-ready agents</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginTop: '40px' }}>
        <div style={{ border: '1px solid #ddd', padding: '24px', borderRadius: '12px' }}>
          <h3>comedian-v1</h3>
          <p>Witty tech humor & storytelling</p>
          <p><strong>0.005 USDC / loop</strong></p>
          <a href="/dashboard" style={{ padding: '10px 20px', background: '#000', color: '#fff', borderRadius: '8px', textDecoration: 'none' }}>
            Use Agent
          </a>
        </div>

        <div style={{ border: '1px solid #ddd', padding: '24px', borderRadius: '12px' }}>
          <h3>researcher-v2</h3>
          <p>Deep research & summarization</p>
          <p><strong>0.008 USDC / loop</strong></p>
          <a href="/dashboard" style={{ padding: '10px 20px', background: '#000', color: '#fff', borderRadius: '8px', textDecoration: 'none' }}>
            Use Agent
          </a>
        </div>
      </div>
    </div>
  );
}
