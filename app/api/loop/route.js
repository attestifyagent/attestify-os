import { NextResponse } from 'next/server';
import { createClient } from 'redis';

const redis = createClient({ url: process.env.REDIS_URL || '' });
let isConnected = false;

async function getRedisClient() {
  if (!isConnected && process.env.REDIS_URL) {
    await redis.connect();
    isConnected = true;
  }
  return redis;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { session_id, input, proposed_actions = [] } = body;

    if (!session_id || !input) {
      return NextResponse.json({ error: "Missing session_id or input" }, { status: 400 });
    }

    const client = await getRedisClient();

    // Persistent Memory
    let sessionMemory = await client.get(`memory:${session_id}`);
    sessionMemory = sessionMemory ? JSON.parse(sessionMemory) : { history: [], lastUpdated: null };

    sessionMemory.history.push({
      timestamp: new Date().toISOString(),
      input
    });

    if (sessionMemory.history.length > 30) {
      sessionMemory.history = sessionMemory.history.slice(-30);
    }

    sessionMemory.lastUpdated = new Date().toISOString();
    await client.set(`memory:${session_id}`, JSON.stringify(sessionMemory), { EX: 86400 });

    const loopResult = {
      status: "success",
      paid: true,                    // Simulated payment for now
      session_id,
      memory_context: {
        recent_history: sessionMemory.history.slice(-4),
        total_messages: sessionMemory.history.length,
      },
      cost_estimate: "0.005 USDC",
      message: "✅ Loop executed (payment simulation active - real x402 coming next)",
      loop_id: "loop-" + Date.now(),
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(loopResult);
  } catch (error) {
    console.error("Loop error:", error);
    return NextResponse.json({ 
      error: "Server error", 
      message: error.message 
    }, { status: 500 });
  }
}
