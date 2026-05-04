// app/api/loop/route.js
import { NextResponse } from 'next/server';
import { createClient } from 'redis';
import { createX402Handler } from '@x402/core';   // or adjust import based on actual package

const redis = createClient({ url: process.env.REDIS_URL });
let isConnected = false;

async function getRedisClient() {
  if (!isConnected && process.env.REDIS_URL) {
    await redis.connect();
    isConnected = true;
  }
  return redis;
}

// x402 Payment Handler
const x402 = createX402Handler({
  payTo: process.env.PAY_TO_ADDRESS,
  chain: "base-sepolia",           // Use "base" for mainnet later
  amount: "0.005",
  currency: "USDC",
  description: "agentic.market /loop execution",
});

export async function POST(request) {
  try {
    // === PAYMENT ENFORCEMENT ===
    const payment = await x402.verify(request);
    if (!payment.paid) {
      return payment.response;   // Returns HTTP 402 automatically
    }

    const body = await request.json();
    const { session_id, input } = body;

    if (!session_id || !input?.trim()) {
      return NextResponse.json({ error: "Missing session_id or input" }, { status: 400 });
    }

    const client = await getRedisClient();

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
      output: `✅ Paid loop executed. Memory now has ${sessionMemory.history.length} messages.`,
      cost: 0.005
    };

    // Assistant message
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
      txHash: payment.txHash
    });

  } catch (error) {
    console.error("Loop error:", error);
    return NextResponse.json({ error: "Server error", message: error.message }, { status: 500 });
  }
}
