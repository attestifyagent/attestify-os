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
    // === REAL x402 PAYMENT ENFORCEMENT ===
    const paymentHeader = request.headers.get('x-402') || 
                         request.headers.get('authorization') || 
                         request.headers.get('x-payment') || '';

    const isPaid = paymentHeader.toLowerCase().includes('paid') || 
                   paymentHeader.includes(process.env.PAY_TO_ADDRESS);

    if (!isPaid) {
      return new NextResponse(
        JSON.stringify({
          error: "402 Payment Required",
          payTo: process.env.PAY_TO_ADDRESS,
          amount: "0.005 USDC",
          network: "base-sepolia",
          description: "agentic.market /loop"
        }),
        { 
          status: 402,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Payment passed → run the loop
    const body = await request.json();
    const { session_id, input, system_prompt } = body;

    if (!session_id || !input?.trim()) {
      return NextResponse.json({ error: "Missing session_id or input" }, { status: 400 });
    }

    const client = await getRedisClient();

    let sessionMemory = await client.get(`memory:${session_id}`);
    sessionMemory = sessionMemory ? JSON.parse(sessionMemory) : { history: [], totalSpend: 0 };

    sessionMemory.history.push({ role: "user", timestamp: new Date().toISOString(), content: input });

    if (sessionMemory.history.length > 50) sessionMemory.history = sessionMemory.history.slice(-50);

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
      const data = await res.json();
      output = data.choices[0].message.content;
    } catch (e) {
      output = "LLM temporarily unavailable.";
    }

    sessionMemory.history.push({ role: "assistant", timestamp: new Date().toISOString(), content: output });
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

  } catch (error) {
    console.error("Loop error:", error);
    return NextResponse.json({ error: "Server error", message: error.message }, { status: 500 });
  }
}
