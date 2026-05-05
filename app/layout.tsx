// app/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Attestify OS — Memory-First Agent Infrastructure',
  description: 'Persistent memory, x402 payments, and production-ready agent loops. Powering agentic.market.',
  keywords: ['ai agents', 'x402', 'memory-first agents', 'agent infrastructure', 'attestify', 'agentic market'],
  authors: [{ name: 'Attestify' }],
  openGraph: {
    title: 'Attestify OS',
    description: 'The open infrastructure for paid, stateful AI agents',
    images: [{ url: 'https://attestify-os.vercel.app/og-image.png' }],
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
