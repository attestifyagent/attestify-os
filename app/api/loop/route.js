// app/api/loop/route.js
import { NextResponse } from 'next/server';
import { createClient } from 'redis';

const redis = createClient({ 
  url: process.env.REDIS_URL 
});

export async function POST(request) {
  try {
    console.log("✅ Loop called");
    console.log("REDIS_URL exists:", !!process.env.REDIS_URL);
    console.log("XAI_API_KEY exists:", !!process.env.XAI_API_KEY);
    console.log("PAY_TO_ADDRESS exists:", !!process.env.PAY_TO_ADDRESS);

    const body = await request.json().catch(() => ({}));
    console.log("Request body:", body);

    const { session_id, input } = body;

    if (!session_id || !input) {
      return NextResponse.json({ error: "Missing session_id or input" }, { status: 400 });
    }

    // Test Redis connection
    let redisStatus = "Not tested";
    try {
      await redis.connect();
      redisStatus = "Connected";
      await redis.ping();
    } catch (e) {
      redisStatus = "Connection failed: " + e.message;
    }

    return NextResponse.json({
      status: "success",
      paid: true,
      session_id,
      output: "Debug mode active - API is responding",
      env_status: {
        redis: redisStatus,
        hasXaiKey: !!process.env.XAI_API_KEY,
        hasPayTo: !!process.env.PAY_TO_ADDRESS
      },
      memory_context: { total_messages: 0 }
    });

  } catch (error) {
    console.error("Full Error:", error);
    return NextResponse.json({
      error: "Server Error",
      message: error.message,
      stack: error.stack ? error.stack.split('\n').slice(0, 5) : null
    }, { status: 500 });
  }
}
