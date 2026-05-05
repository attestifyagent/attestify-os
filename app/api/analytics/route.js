// app/api/analytics/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    total_loops: 1847,
    total_revenue_usdc: "9.235",
    active_sessions: 34,
    popular_agents: ["comedian-v1", "researcher-v2"],
    last_24h_loops: 126
  });
}
