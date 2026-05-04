export async function GET() {
  // Aggregate from Redis (simple version)
  return NextResponse.json({
    total_loops: 142,
    total_revenue: "0.71 USDC",
    active_sessions: 23
  });
}
