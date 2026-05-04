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

async function callGrok(messages) {
  if (!process.env.XAI_API_KEY) {
    throw new Error("❌ XAI_API_KEY is missing in environment variables");
  }

  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.XAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: "grok-4-1-fast-reasoning",   // cheap + good
      messages,
      temperature: 0.7,
      max_tokens: 600,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`LLM Error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

export async function POST(request) {
  try {
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
      ...sessionMemory.history.map(m => ({ role: m.role, content: m.content }))
    ];

    let output = "LLM call failed";
    try {
      output = await callGrok(messages);
    } catch (e) {
      console.error("LLM Error:", e.message);
      output = `Error: ${e.message}`;
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
      cost_estimate: "0.005 USDC"
    });

  } catch (error) {
    console.error("Loop error:", error);
    return NextResponse.json({ error: "Server error", message: error.message }, { status: 500 });
  }
}
