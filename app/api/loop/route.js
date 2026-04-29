import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    
    return NextResponse.json({
      status: "loop_received",
      session_id: body.session_id || "unknown",
      message: "✅ Full loop placeholder working! Memory + Cost + Sandbox + Orchestration coming next.",
      loop_id: "loop-" + Date.now(),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ 
      error: "Invalid request",
      message: error.message 
    }, { status: 400 });
  }
}
