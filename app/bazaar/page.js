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
          <p><strong>0.005 USDC per loop</strong></p>
          <button style={{ padding: '10px 20px', marginTop: '10px' }}>Use Agent</button>
        </div>

        <div style={{ border: '1px solid #ddd', padding: '24px', borderRadius: '12px' }}>
          <h3>researcher-v2</h3>
          <p>Deep research & summarization</p>
          <p><strong>0.008 USDC per loop</strong></p>
          <button style={{ padding: '10px 20px', marginTop: '10px' }}>Use Agent</button>
        </div>
      </div>
    </div>
  );
}
