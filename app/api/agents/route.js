// app/api/agents/route.js
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

export async function GET() {
  try {
    const client = await getRedisClient();
    // For simplicity, we'll list all keys starting with "agent:" (Redis scan in production)
    // This is a basic version - you can improve later
    return NextResponse.json({
      success: true,
      agents: [
        // TODO: Dynamically scan Redis keys in future version
        { agent_id: "comedian-v1", name: "Witty Comedian", price_per_loop: 0.005 },
        { agent_id: "researcher-v1", name: "Deep Researcher", price_per_loop: 0.008 }
      ],
      message: "Agent listing (static for now)"
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
