// app/api/loop/route.js
import { NextResponse } from 'next/server';
import { createClient } from 'redis';
import { createX402Handler } from '@x402/core';
import { ExactEvmScheme } from '@x402/evm/exact';

const redis = createClient({ url: process.env.REDIS_URL });
let isConnected = false;

async function getRedisClient() {
  if (!isConnected && process.env.REDIS_URL) {
    await redis.connect();
    isConnected = true;
  }
  return redis;
}

// x402 Payment Handler Setup
const x402 = createX402Handler({
  schemes: [
    new ExactEvmScheme({
      chainId: 84532, // Base Sepolia (use 8453 for Base mainnet later)
    }),
  ],
  payTo: process.env.PAY_TO_ADDRESS,
  amount: "0.005",        // in smallest unit (USDC has 6 decimals → 0.005 = 5000)
  currency: "USDC",
  description: "agentic.market /loop - Memory-First Agent Execution",
});

export async function POST(request) {
  try {
    // === 1. ENFORCE x402 PAYMENT ===
    const paymentResult = await x402.verify(request);

    if (!paymentResult.paid) {
      return paymentResult.response; // Automatically returns 402 with payment instructions
    }

    // Payment successful → continue
    const body = await request.json();
    const { session_id, input } = body;

    if (!session_id || !input?.trim()) {
      return NextResponse.json({ error: "Missing session_id or input" }, { status: 400 });
    }

    const client = await getRedisClient();

    let sessionMemory = await client.get(`memory:${session_id}`);
    sessionMemory = sessionMemory ? JSON.parse(sessionMemory) : { history: [], totalSpend: 0 };

    // Store user input
    sessionMemory.history.push({
      role: "user",
      timestamp: new Date().toISOString(),
      content: input
    });

    if (sessionMemory.history.length > 50) {
      sessionMemory.history = sessionMemory.history.slice(-50);
    }

    // Agent execution
    const result = {
      output: `✅ Paid loop executed successfully!\nMemory now contains ${sessionMemory.history.length} messages.`,
      cost: 0.005
    };

    // Store assistant response
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
      txHash: paymentResult.txHash
    });

  } catch (error) {
    console.error("Loop error:", error);
    return NextResponse.json({ error: "Server error", message: error.message }, { status: 500 });
  }
}
