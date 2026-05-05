// app/bazaar/page.js
'use client';

export default function Bazaar() {
  const agents = [
    {
      id: "comedian-v1",
      name: "Comedian-v1",
      description: "Witty tech humor & storytelling",
      price: "0.005 USDC",
      emoji: "😂"
    },
    {
      id: "researcher-v2",
      name: "Researcher-v2",
      description: "Deep research & summarization",
      price: "0.008 USDC",
      emoji: "🔍"
    }
  ];

  const useAgent = (agentId) => {
    window.open(`/dashboard?agent=${agentId}`, '_blank');
  };

  return (
    <div style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>🛍️ Attestify OS — Bazaar</h1>
      <p>Production-ready agents powered by Attestify OS</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '30px', marginTop: '40px' }}>
        {agents.map(agent => (
          <div key={agent.id} style={{
            border: '1px solid #ddd',
            borderRadius: '16px',
            padding: '32px',
            background: '#fff',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>{agent.emoji}</div>
            <h3 style={{ margin: '0 0 8px 0' }}>{agent.name}</h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>{agent.description}</p>
            <div style={{ fontWeight: 'bold', marginBottom: '24px' }}>{agent.price} per loop</div>
            
            <button 
              onClick={() => useAgent(agent.id)}
              style={{ width: '100%', padding: '14px', background: '#000', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
            >
              Use This Agent →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
