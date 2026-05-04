// app/api/loop/route.js
import { NextResponse } from 'next/server';
import { createClient } from 'redis';

const redis = createClient({ url: process.env.REDIS_URL });

export async function POST(request) {
  try {
    console.log("Loop called with headers:", Object.fromEntries(request.headers));

    const body = await request.json().catch(() => ({}));
    console.log("Request body:", body);

    const { session_id, input } = body;

    if (!session_id || !input) {
      return NextResponse.json({ error: "Missing session_id or input" }, { status: 400 });
    }

    // Simple response for debugging
    return NextResponse.json({
      status: "success",
      paid: true,
      session_id,
      output: "Debug mode: API is responding. Check Vercel logs for full details.",
      memory_context: { total_messages: 0 }
    });

  } catch (error) {
    console.error("Full Error:", error);
    return NextResponse.json({ 
      error: "Server Error", 
      message: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}
