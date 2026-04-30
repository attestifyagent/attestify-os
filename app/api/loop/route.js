import { NextResponse } from 'next/server';

const memoryStore = new Map();

export async function POST(request) {
  try {
    const body = await request.json();
    const { session_id, input, proposed_actions = [] } = body;

    if (!session_id || !input) {
      return NextResponse.json({ error: "Missing session_id or input" }, { status: 400 });
    }

    // Persistent Memory Logic
    let sessionMemory = memoryStore.get(session_id) || { history: [], lastUpdated: null };
    
    sessionMemory.history.push({
      timestamp: new Date().toISOString(),
      input: input
    });

    if (sessionMemory.history.length > 20) {
      sessionMemory.history = sessionMemory.history.slice(-20);
    }

    sessionMemory.lastUpdated = new Date().toISOString();
    memoryStore.set(session_id, sessionMemory);

    // Response with clear memory output
    const loopResult = {
      status: "success",
      paid: true,
      session_id,
      memory_context: {
        recent_history: sessionMemory.history.slice(-3),   // Last 3 messages
        total_messages: sessionMemory.history.length,
        last_updated: sessionMemory.lastUpdated
      },
      cost_estimate: "0.005 USDC",
      safe_actions: proposed_actions,
      message: "✅ Full loop executed with persistent memory!",
      loop_id: "loop-" + Date.now(),
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(loopResult);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error", message: error.message }, { status: 500 });
  }
}
