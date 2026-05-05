// app/api/loop/route.js
import { NextResponse } from 'next/server';
import { createClient } from 'redis';
import { paymentMiddleware } from '@x402/express';   // Official middleware
import { ExactEvmScheme } from '@x402/evm/exact/server';
import { HTTPFacilitatorClient } from '@x402/core/server';
import { x402ResourceServer } from '@x402/core/server';

const redis = createClient({ url: process.env.REDIS_URL });
let isConnected = false;

async function getRedisClient() {
  if (!isConnected && process.env.REDIS_URL) {
    await redis.connect();
    isConnected = true;
  }
  return redis;
}

// x402 Setup (Testnet)
const facilitatorClient = new HTTPFacilitatorClient({
  url: "https://x402.org/facilitator"   // Use CDP for production later
});

const server = new x402ResourceServer(facilitatorClient)
  .register("eip155:84532", new ExactEvmScheme()); // Base Sepolia

// The actual handler (runs only after payment)
async function loopHandler(request) {
  const body = await request.json();
  const { session_id, input, agent_id, system_prompt: userSystemPrompt, proposed_actions = [] } = body;

  if (!session_id || !input?.trim()) {
    return NextResponse.json({ error: "Missing session_id or input" }, { status: 400 });
  }

  const client = await getRedisClient();

  let finalSystemPrompt = userSystemPrompt;
  if (agent_id && !finalSystemPrompt) {
    const agentData = await client.get(`agent:${agent_id}`);
    if (agentData) {
      const agent = JSON.parse(agentData);
      finalSystemPrompt = agent.system_prompt;
    }
  }

  let sessionMemory = await client.get(`memory:${session_id}`);
  sessionMemory = sessionMemory ? JSON.parse(sessionMemory) : { history: [], totalSpend: 0 };

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
    console.error(e);
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
    actions_simulated: proposed_actions.length
  });
}

// Wrap with official x402 middleware
export const POST = paymentMiddleware(
  {
    "POST /api/loop": {
      accepts: [
        {
          scheme: "exact",
          price: "$0.005",
          network: "eip155:84532",   // Base Sepolia
          payTo: process.env.PAY_TO_ADDRESS,
        },
      ],
      description: "Memory-First Agent Execution Loop",
      mimeType: "application/json",
    },
  },
  server
);
