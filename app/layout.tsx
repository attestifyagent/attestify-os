// app/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'agentic.market — Bazaar for AI Agents',
  description: 'Memory-first, paid, stateful AI agent infrastructure with x402 micropayments.',
  keywords: ['ai agents', 'agent marketplace', 'x402', 'memory-first agents', 'agentic'],
  openGraph: {
    title: 'agentic.market',
    description: 'The infrastructure layer for production AI agents.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
