// app/api/analytics/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    total_loops: 1542,
    total_revenue: "7.68 USDC",
    active_sessions: 27,
    popular_agents: ["comedian-v1", "researcher-v2"],
    top_performing: "comedian-v1"
  });
}
