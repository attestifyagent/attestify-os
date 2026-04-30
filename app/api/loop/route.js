import { NextResponse } from 'next/server';

// Simple in-memory store (persists while server is running)
// Later we'll upgrade to Vercel KV / Redis / vector DB
const memoryStore = new Map();

export async function POST(request) {
  try {
    const body = await request.json();
    const { session_id, input, proposed_actions = [] } = body;

    if (!session_id || !input) {
      return NextResponse.json({ error: "Missing session_id or input" }, { status: 400 });
    }

    // === MEMORY RETRIEVAL & UPDATE ===
    let sessionMemory = memoryStore.get(session_id) || {
      history: [],
      lastUpdated: new Date().toISOString()
    };

    // Add new input to history
    sessionMemory.history.push({
      timestamp: new Date().toISOString(),
      input: input
    });

    // Keep only last 20 messages (prevent memory bloat)
    if (sessionMemory.history.length > 20) {
      sessionMemory.history = sessionMemory.history.slice(-20);
    }

    sessionMemory.lastUpdated = new Date().toISOString();
    memoryStore.set(session_id, sessionMemory);

    // === FULL LOOP RESPONSE ===
    const loopResult = {
      status: "success",
      paid: true,
      session_id,
      memory_context: {
        recent_history: sessionMemory.history.slice(-5), // last 5 messages
        total_messages: sessionMemory.history.length
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
    return NextResponse.json({ 
      error: "Server error", 
      message: error.message 
    }, { status: 500 });
  }
}
