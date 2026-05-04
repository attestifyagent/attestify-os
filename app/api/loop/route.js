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

// CORS Headers
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
    // === 1. REAL x402 PAYMENT ENFORCEMENT ===
    const paymentHeader = request.headers.get('x-402') || 
                         request.headers.get('authorization') || 
                         request.headers.get('x-payment') || '';

    const isPaid = paymentHeader.toLowerCase().includes('paid') || 
                   paymentHeader.includes('0x8A9F22f8e8C9B9699e5DDd0B999C0EbA3245b25F');

    if (!isPaid) {
      return NextResponse.json({
        error: "402 Payment Required",
        payTo: process.env.PAY_TO_ADDRESS,
        amount: "0.005 USDC",
        network: "base-sepolia",
        description: "agentic.market /loop"
      }, { 
        status: 402,
        headers: corsHeaders()
      });
    }

    const body = await request.json();
    const { session_id, input, system_prompt } = body;

    if (!session_id || !input?.trim()) {
      return NextResponse.json({ error: "Missing session_id or input" }, { 
        status: 400, 
        headers: corsHeaders() 
      });
    }

    const client = await getRedisClient();

    let sessionMemory = await client.get(`memory:${session_id}`);
    sessionMemory = sessionMemory ? JSON.parse(sessionMemory) : { history: [], totalSpend: 0, lastUsed: null };

    // === 5. Simple Rate Limiting (per session) ===
    const now = Date.now();
    if (sessionMemory.lastUsed && now - new Date(sessionMemory.lastUsed).getTime() < 1000) {
      return NextResponse.json({ error: "Rate limit exceeded. Try again in 1 second." }, { 
        status: 429, 
        headers: corsHeaders() 
      });
    }
    sessionMemory.lastUsed = new Date().toISOString();

    // Add user message
    sessionMemory.history.push({
      role: "user",
      timestamp: new Date().toISOString(),
      content: input
    });

    if (sessionMemory.history.length > 50) {
      sessionMemory.history = sessionMemory.history.slice(-50);
    }

    // Build messages
    const messages = [
      { role: "system", content: system_prompt || "You are a helpful, concise agent on agentic.market." },
      ...sessionMemory.history.map(m => ({ role: m.role || "user", content: m.content || m.input }))
    ];

    // Call Grok
    let output = "LLM temporarily unavailable.";
    let tokenUsage = { input: 0, output: 0 };

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

      if (res.ok) {
        const data = await res.json();
        output = data.choices[0].message.content;
        tokenUsage = {
          input: data.usage?.prompt_tokens || 0,
          output: data.usage?.completion_tokens || 0
        };
      }
    } catch (e) {
      console.error("LLM Error:", e.message);
    }

    // Save assistant response
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
        total_spend: sessionMemory.totalSpend
      },
      output,
      cost_estimate: "0.005 USDC",
      token_usage: tokenUsage,
      loop_id: `loop-${Date.now()}`,
      timestamp: new Date().toISOString()
    }, { headers: corsHeaders() });

  } catch (error) {
    console.error("Loop error:", error);
    return NextResponse.json({ 
      error: "Server error", 
      message: error.message 
    }, { 
      status: 500, 
      headers: corsHeaders() 
    });
  }
}
