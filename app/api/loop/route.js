import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { session_id, input, proposed_actions = [] } = body;

    if (!session_id || !input) {
      return NextResponse.json({ error: "Missing session_id or input" }, { status: 400 });
    }

    // TODO: x402 payment check will go here soon
    // For now we simulate successful payment (we'll add real x402 next)

    const loopResult = {
      status: "success",
      paid: true,
      session_id,
      memory_context: "✅ Memory stub active - persistent memory next!",
      cost_estimate: "0.005 USDC",
      safe_actions: proposed_actions,
      message: "Full loop executed (payment simulation active)",
      loop_id: "loop-" + Date.now(),
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(loopResult);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ 
      error: "Server error", 
      message: error.message 
    }, { status: 500 });
  }
}
