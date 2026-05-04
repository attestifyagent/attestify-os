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
    // x402 Payment
    const paymentHeader = request.headers.get('x-402') || request.headers.get('authorization') || request.headers.get('x-payment') || '';
    const isPaid = paymentHeader.toLowerCase().includes('paid') || paymentHeader.includes(process.env.PAY_TO_ADDRESS || '');

    if (!isPaid) {
      return NextResponse.json({ error: "402 Payment Required", payTo: process.env.PAY_TO_ADDRESS, amount: "0.005 USDC" }, 
        { status: 402, headers: corsHeaders() });
    }

    const body = await request.json();
    const { session_id, input, agent_id, system_prompt: userSystemPrompt, proposed_actions = [] } = body;

    if (!session_id || !input?.trim()) {
      return NextResponse.json({ error: "Missing session_id or input" }, { status: 400, headers: corsHeaders() });
    }

    const client = await getRedisClient();

    let finalSystemPrompt = userSystemPrompt;

    // === Auto-load system prompt from registered agent ===
    if (agent_id && !finalSystemPrompt) {
      const agentData = await client.get(`agent:${agent_id}`);
      if (agentData) {
        const agent = JSON.parse(agentData);
        finalSystemPrompt = agent.system_prompt;
      }
    }

    // ... (rest of your memory + LLM logic remains the same)

    let sessionMemory = await client.get(`memory:${session_id}`);
    sessionMemory = sessionMemory ? JSON.parse(sessionMemory) : { history: [], totalSpend: 0, lastUsed: null };

    // Rate limiting, history, LLM call, actions simulation... (same as before)

    // (I kept it short here — use the full version from previous message and just add the agent loading part above)

    return NextResponse.json({
      status: "success",
      paid: true,
      session_id,
      agent_id,
      output: "Test successful with agent loading",
      // ... other fields
    }, { headers: corsHeaders() });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
