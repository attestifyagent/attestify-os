// app/bazaar/page.js
'use client';

export default function Bazaar() {
  const agents = [
    {
      id: "comedian-v1",
      name: "Comedian-v1",
      description: "Witty tech humor, storytelling & entertainment",
      price: "0.005 USDC",
      emoji: "😂"
    },
    {
      id: "researcher-v2",
      name: "Researcher-v2",
      description: "Deep research, summarization & analysis",
      price: "0.008 USDC",
      emoji: "🔍"
    }
  ];

  const useAgent = (agentId) => {
    const sessionId = "bazaar-" + Date.now();
    window.open(`/dashboard?agent=${agentId}&session=${sessionId}`, '_blank');
  };

  return (
    <div style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'system-ui' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1>🛍️ Attestify OS — Bazaar</h1>
        <p style={{ fontSize: '22px', color: '#555' }}>
          Browse and run production-ready agents
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '30px' }}>
        {agents.map(agent => (
          <div 
            key={agent.id} 
            style={{
              border: '1px solid #ddd',
              borderRadius: '16px',
              padding: '32px',
              background: '#fff',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>{agent.emoji}</div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>{agent.name}</h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>{agent.description}</p>
            
            <div style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '24px' }}>
              {agent.price} per loop
            </div>

            <button 
              onClick={() => useAgent(agent.id)}
              style={{
                width: '100%',
                padding: '14px',
                background: '#000',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              Use This Agent →
            </button>
          </div>
        ))}
      </div>

      <p style={{ textAlign: 'center', marginTop: '80px', color: '#888' }}>
        More agents coming soon. All payments enforced via x402.
      </p>
    </div>
  );
}
