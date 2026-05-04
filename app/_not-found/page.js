// app/_not-found/page.js
export default function NotFound() {
  return (
    <div style={{ padding: '80px 20px', textAlign: 'center', fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: '48px' }}>404</h1>
      <p>Page not found</p>
      <a href="/" style={{ color: 'blue' }}>← Go back home</a>
    </div>
  );
}
