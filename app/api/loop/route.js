import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function POST(request) {
  try {
    const body = await request.json();
    const { session_id, input, proposed_actions = [] } = body;

    if (!session_id || !input) {
      return NextResponse.json({ error: "Missing session_id or input" }, { status: 400 });
    }

    // === PERSISTENT MEMORY USING VERCEL KV ===
    let sessionMemory = await kv.get(`memory:${session_id}`) || { 
      history: [], 
      lastUpdated: null 
    };

    sessionMemory.history.push({
      timestamp: new Date().toISOString(),
      input: input
    });

    // Keep last 30 messages
    if (sessionMemory.history.length > 30) {
      sessionMemory.history = sessionMemory.history.slice(-30);
    }

    sessionMemory.lastUpdated = new Date().toISOString();

    // Save back to KV
    await kv.set(`memory:${session_id}`, sessionMemory, { ex: 86400 }); // expires in 24h

    // Response
    const loopResult = {
      status: "success",
      paid: true,
      session_id,
      memory_context: {
        recent_history: sessionMemory.history.slice(-4),
        total_messages: sessionMemory.history.length,
        last_updated: sessionMemory.lastUpdated
      },
      cost_estimate: "0.005 USDC",
      safe_actions: proposed_actions,
      message: "✅ Full loop with **persistent** memory (Vercel KV)",
      loop_id: "loop-" + Date.now(),
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(loopResult);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error", message: error.message }, { status: 500 });
  }
}
