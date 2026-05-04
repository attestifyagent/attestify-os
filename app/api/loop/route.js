// app/api/loop/route.js
import { NextResponse } from 'next/server';
import { createClient } from 'redis';
import { withX402 } from '@x402/next';
import { x402ResourceServer, HTTPFacilitatorClient } from '@x402/core/server';
import { ExactEvmScheme } from '@x402/evm/exact/server';

const redis = createClient({ url: process.env.REDIS_URL });
let isConnected = false;

async function getRedisClient() {
  if (!isConnected && process.env.REDIS_URL) {
    await redis.connect();
    isConnected = true;
  }
  return redis;
}

// x402 Setup
const facilitator = new HTTPFacilitatorClient({
  url: "https://x402.org/facilitator",
});

const server = new x402ResourceServer(facilitator)
  .register("eip155:84532", new ExactEvmScheme()); // Base Sepolia

// The actual loop logic (only runs after successful payment)
async function loopHandler(request) {
  const body = await request.json();
  const { session_id, input, system_prompt } = body;

  if (!session_id || !input?.trim()) {
    return NextResponse.json({ error: "Missing session_id or input" }, { status: 400 });
  }

  const client = await getRedisClient();

  let sessionMemory = await client.get(`memory:${session_id}`);
  sessionMemory = sessionMemory ? JSON.parse(sessionMemory) : { history: [], totalSpend: 0 };

  sessionMemory.history.push({
    role: "user",
    timestamp: new Date().toISOString(),
    content: input
  });

  if (sessionMemory.history.length > 50) {
    sessionMemory.history = sessionMemory.history.slice(-50);
  }

  const messages = [
    { role: "system", content: system_prompt || "You are a helpful, concise agent on agentic.market." },
    ...sessionMemory.history.map(m => ({ role: m.role || "user", content: m.content || m.input }))
  ];

  let output;
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
        max_tokens: 600,
      }),
    });

    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    output = data.choices[0].message.content;
  } catch (e) {
    output = "LLM temporarily unavailable. Memory is working.";
  }

  sessionMemory.history.push({
    role: "assistant",
    timestamp: new Date().toISOString(),
    content: output
  });

  sessionMemory.totalSpend = (sessionMemory.totalSpend || 0) + 0.005;

  await client.set(`memory:${session_id}`, JSON.stringify(sessionMemory), { EX: 2592000 });

  return NextResponse.json({
    status: "success",
    paid: true,
    session_id,
    memory_context: {
      recent_history: sessionMemory.history.slice(-8),
      total_messages: sessionMemory.history.length,
    },
    output,
    cost_estimate: "0.005 USDC",
    loop_id: `loop-${Date.now()}`,
    timestamp: new Date().toISOString()
  });
}

// Wrap with real x402 protection
export const POST = withX402(loopHandler, {
  accepts: [{
    scheme: "exact",
    price: "$0.005",
    network: "eip155:84532",           // Base Sepolia (change to 8453 for mainnet)
    payTo: process.env.PAY_TO_ADDRESS,
  }],
  description: "agentic.market Memory-First Agent Loop",
});
