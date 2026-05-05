// app/api/analytics/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    total_loops: 2451,
    total_revenue_usdc: "12.355",
    active_sessions: 47,
    popular_agents: ["comedian-v1", "researcher-v2"],
    last_24h_loops: 156
  });
}
