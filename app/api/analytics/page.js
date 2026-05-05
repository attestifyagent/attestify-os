// app/analytics/page.js
export default function Analytics() {
  return (
    <div style={{ padding: '60px 20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>📊 Attestify OS Analytics</h1>
      <p>Platform usage and revenue overview</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '40px' }}>
        <div style={{ border: '1px solid #ddd', padding: '24px', borderRadius: '12px' }}>
          <h3>Total Loops</h3>
          <p style={{ fontSize: '42px', fontWeight: 'bold' }}>2,847</p>
        </div>
        <div style={{ border: '1px solid #ddd', padding: '24px', borderRadius: '12px' }}>
          <h3>Total Revenue</h3>
          <p style={{ fontSize: '42px', fontWeight: 'bold' }}>14.235 USDC</p>
        </div>
        <div style={{ border: '1px solid #ddd', padding: '24px', borderRadius: '12px' }}>
          <h3>Active Sessions</h3>
          <p style={{ fontSize: '42px', fontWeight: 'bold' }}>52</p>
        </div>
      </div>

      <p style={{ marginTop: '60px', textAlign: 'center', color: '#666' }}>
        Real-time stats will be added soon.
      </p>
    </div>
  );
}
