import { NextResponse } from 'next/server';
import { createClient } from 'redis';

const redis = createClient({ url: process.env.REDIS_URL });
let isConnected = false;

async function getRedisClient() {
  if (!isConnected) {
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

    // === x402 Payment is handled by proxy.ts middleware ===

    const client = await getRedisClient();

    // Persistent Memory
    let sessionMemory = await client.get(`memory:${session_id}`);
    sessionMemory = sessionMemory ? JSON.parse(sessionMemory) : { history: [], lastUpdated: null };

    sessionMemory.history.push({ timestamp: new Date().toISOString(), input });
    if (sessionMemory.history.length > 30) sessionMemory.history = sessionMemory.history.slice(-30);
    sessionMemory.lastUpdated = new Date().toISOString();

    await client.set(`memory:${session_id}`, JSON.stringify(sessionMemory), { EX: 86400 });

    const loopResult = {
      status: "success",
      paid: true,
      session_id,
      memory_context: {
        recent_history: sessionMemory.history.slice(-4),
        total_messages: sessionMemory.history.length,
      },
      cost_estimate: "0.005 USDC",
      safe_actions: proposed_actions,
      message: "✅ x402 payment received + Full loop with persistent memory!",
      loop_id: "loop-" + Date.now(),
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(loopResult);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error", message: error.message }, { status: 500 });
  }
}
