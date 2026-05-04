// app/api/agents/register/route.js
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
    const { agent_id, name, description, system_prompt, price_per_loop = 0.005, owner } = await request.json();

    if (!agent_id || !name) {
      return NextResponse.json({ error: "Missing agent_id or name" }, { status: 400 });
    }

    const client = await getRedisClient();
    const agentData = {
      agent_id,
      name,
      description,
      system_prompt,
      price_per_loop,
      owner,
      createdAt: new Date().toISOString(),
      status: "active"
    };

    await client.set(`agent:${agent_id}`, JSON.stringify(agentData), { EX: 2592000 });

    return NextResponse.json({
      success: true,
      message: `Agent ${agent_id} registered successfully`,
      agent: agentData
    });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
