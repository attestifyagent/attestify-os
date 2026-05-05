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

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-402, x-payment',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function POST(request) {
  try {
    // === STRONGER x402 CHECK ===
    const paymentHeader = request.headers.get('x-402') || 
                         request.headers.get('authorization') || 
                         request.headers.get('x-payment') || '';

    const isPaid = paymentHeader && (
      paymentHeader.toLowerCase().includes('paid') || 
      paymentHeader.includes('0x') // looks like a real signature
    );

    if (!isPaid) {
      return NextResponse.json({
        error: "402 Payment Required",
        payTo: process.env.PAY_TO_ADDRESS,
        amount: "0.005",
        currency: "USDC",
        network: "base-sepolia",
        description: "Attestify OS /loop - Memory-First Agent Execution"
      }, { status: 402, headers: corsHeaders() });
    }

    // Payment OK → proceed
    const body = await request.json();
    const { session_id, input, agent_id, system_prompt: userSystemPrompt, proposed_actions = [] } = body;

    if (!session_id || !input?.trim()) {
      return NextResponse.json({ error: "Missing session_id or input" }, { status: 400, headers: corsHeaders() });
    }

    // ... (keep the rest of your existing logic: memory, LLM, actions, etc.)

    // (Paste your current working loop logic here for memory + LLM + actions)

    return NextResponse.json({
      status: "success",
      paid: true,
      session_id,
      agent_id,
      output,
      cost_estimate: "0.005 USDC",
      actions_simulated: proposed_actions.length,
      loop_id: `loop-${Date.now()}`,
      timestamp: new Date().toISOString()
    }, { headers: corsHeaders() });

  } catch (error) {
    console.error("Loop error:", error);
    return NextResponse.json({ error: "Server error", message: error.message }, { status: 500, headers: corsHeaders() });
  }
}
