// app/api/loop/route.js
import { NextResponse } from 'next/server';
import { createClient } from 'redis';

const redis = createClient({ url: process.env.REDIS_URL });
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
    const { session_id, input } = body;

    if (!session_id || !input?.trim()) {
      return NextResponse.json({ error: "Missing session_id or input" }, { status: 400 });
    }

    const client = await getRedisClient();

    // Load memory
    let sessionMemory = await client.get(`memory:${session_id}`);
    sessionMemory = sessionMemory ? JSON.parse(sessionMemory) : { history: [], totalSpend: 0 };

    // User message
    sessionMemory.history.push({
      role: "user",
      timestamp: new Date().toISOString(),
      content: input
    });

    if (sessionMemory.history.length > 50) {
      sessionMemory.history = sessionMemory.history.slice(-50);
    }

    // Agent response
    const result = {
      output: `✅ Loop executed successfully!\nMemory now contains ${sessionMemory.history.length} messages.`,
      cost: 0.005
    };

    // Assistant response
    sessionMemory.history.push({
      role: "assistant",
      timestamp: new Date().toISOString(),
      content: result.output
    });

    sessionMemory.totalSpend = (sessionMemory.totalSpend || 0) + result.cost;

    await client.set(`memory:${session_id}`, JSON.stringify(sessionMemory), { EX: 2592000 });

    return NextResponse.json({
      status: "success",
      paid: true,
      session_id,
      memory_context: {
        recent_history: sessionMemory.history.slice(-8),
        total_messages: sessionMemory.history.length,
        total_spend: sessionMemory.totalSpend
      },
      output: result.output,
      cost_estimate: "0.005 USDC",
      loop_id: `loop-${Date.now()}`,
      timestamp: new Date().toISOString(),
      note: "Real x402 payment enforcement coming in next update"
    });

  } catch (error) {
    console.error("Loop error:", error);
    return NextResponse.json({ error: "Server error", message: error.message }, { status: 500 });
  }
}
