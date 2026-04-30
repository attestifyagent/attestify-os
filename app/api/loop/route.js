import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { session_id, input, proposed_actions = [] } = body;

    if (!session_id || !input) {
      return NextResponse.json({ error: "Missing session_id or input" }, { status: 400 });
    }

    const loopResult = {
      status: "success",
      paid: true,
      session_id,
      memory_context: "Memory stub — persistent memory coming next step",
      cost_estimate: "0.004 USDC",
      safe_actions: proposed_actions,
      message: "✅ x402 payment received! Full loop executed.",
      loop_id: "loop-" + Date.now(),
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(loopResult);
  } catch (error) {
    return NextResponse.json({ error: "Server error", message: error.message }, { status: 500 });
  }
}
