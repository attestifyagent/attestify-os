import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // TODO: Add memory, cost, sandbox, orchestration logic here
    // For now, return a simple response
    
    return NextResponse.json({
      status: "loop_received",
      session_id: body.session_id,
      message: "Full loop placeholder - memory + cost + sandbox coming soon!",
      loop_id: "loop-" + Date.now()
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
