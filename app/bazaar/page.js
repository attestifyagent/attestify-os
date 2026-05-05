// app/bazaar/page.js
export default function Bazaar() {
  return (
    <div style={{ padding: '40px' }}>
      <h1>🛍️ agentic.market Bazaar</h1>
      <p>Browse and use production agents</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '30px' }}>
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '12px' }}>
          <h3>comedian-v1</h3>
          <p>Witty tech humor agent</p>
          <p><strong>0.005 USDC / loop</strong></p>
          <button style={{ padding: '8px 16px' }}>Use Agent</button>
        </div>
        
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '12px' }}>
          <h3>researcher-v2</h3>
          <p>Deep research & summarization</p>
          <p><strong>0.008 USDC / loop</strong></p>
          <button style={{ padding: '8px 16px' }}>Use Agent</button>
        </div>
      </div>
    </div>
  );
}
