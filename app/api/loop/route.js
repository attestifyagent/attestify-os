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
    // === Simple x402 Check (real enforcement coming soon) ===
    const authHeader = request.headers.get('authorization') || '';
    const paymentHeader = request.headers.get('x-payment') || request.headers.get('x-402') || '';

    // For now, accept either real x402 header or simulation
    const isPaid = paymentHeader.includes('paid') || true; // ← Change to strict check later

    if (!isPaid) {
      return new NextResponse(
        JSON.stringify({ error: "Payment required (x402)", payTo: process.env.PAY_TO_ADDRESS }),
        { status: 402, headers: { 'Content-Type': 'application/json' } }
      );
    }

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
      output = "LLM temporarily unavailable.";
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

  } catch (error) {
    console.error("Loop error:", error);
    return NextResponse.json({ error: "Server error", message: error.message }, { status: 500 });
  }
}
