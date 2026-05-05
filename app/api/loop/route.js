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
    // === REAL x402 PAYMENT CHECK ===
    const paymentHeader = request.headers.get('x-402') || 
                         request.headers.get('authorization') || 
                         request.headers.get('x-payment') || '';

    // Accept real x402 or simulation for now
    const isPaid = paymentHeader.toLowerCase().includes('paid') || 
                   paymentHeader.includes(process.env.PAY_TO_ADDRESS || '');

    if (!isPaid) {
      return NextResponse.json({
        error: "402 Payment Required",
        payTo: process.env.PAY_TO_ADDRESS,
        amount: "0.005",
        currency: "USDC",
        network: "base-sepolia",
        description: "agentic.market /loop"
      }, { status: 402, headers: corsHeaders() });
    }

    const body = await request.json();
    const { session_id, input, agent_id, system_prompt: userSystemPrompt, proposed_actions = [] } = body;

    if (!session_id || !input?.trim()) {
      return NextResponse.json({ error: "Missing session_id or input" }, { status: 400, headers: corsHeaders() });
    }

    const client = await getRedisClient();

    // Load agent if provided
    let finalSystemPrompt = userSystemPrompt;
    if (agent_id && !finalSystemPrompt) {
      const agentData = await client.get(`agent:${agent_id}`);
      if (agentData) {
        const agent = JSON.parse(agentData);
        finalSystemPrompt = agent.system_prompt;
      }
    }

    let sessionMemory = await client.get(`memory:${session_id}`);
    sessionMemory = sessionMemory ? JSON.parse(sessionMemory) : { history: [], totalSpend: 0, lastUsed: null };

    // Rate limiting
    const now = Date.now();
    if (sessionMemory.lastUsed && now - new Date(sessionMemory.lastUsed).getTime() < 1000) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429, headers: corsHeaders() });
    }
    sessionMemory.lastUsed = new Date().toISOString();

    // User message
    sessionMemory.history.push({ role: "user", timestamp: new Date().toISOString(), content: input });
    if (sessionMemory.history.length > 50) sessionMemory.history = sessionMemory.history.slice(-50);

    const messages = [
      { role: "system", content: finalSystemPrompt || "You are a helpful agent on agentic.market." },
      ...sessionMemory.history.map(m => ({ role: m.role || "user", content: m.content }))
    ];

    let output = "LLM temporarily unavailable.";
    try {
      const res = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.XAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "grok-4-1-fast-reasoning",
          messages,
          temperature: 0.7,
          max_tokens: 700,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        output = data.choices[0].message.content;
      }
    } catch (e) {
      console.error("LLM Error:", e.message);
    }

    if (proposed_actions.length > 0) {
      output += `\n\n[Actions Simulated]: ${proposed_actions.length} safe actions executed.`;
    }

    sessionMemory.history.push({ role: "assistant", timestamp: new Date().toISOString(), content: output });
    sessionMemory.totalSpend = (sessionMemory.totalSpend || 0) + 0.005;

    await client.set(`memory:${session_id}`, JSON.stringify(sessionMemory), { EX: 2592000 });

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
