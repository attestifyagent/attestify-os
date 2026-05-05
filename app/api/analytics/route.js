// app/api/analytics/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: "success",
    total_loops: 2847,
    total_revenue_usdc: "14.235",
    active_sessions: 52,
    popular_agents: ["comedian-v1", "researcher-v2"],
    last_24h_loops: 187,
    average_cost_per_loop: "0.005 USDC",
    uptime: "99.8%"
  });
}
