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
    // === Improved x402 Check ===
    const paymentHeader = request.headers.get('x-402') || 
                         request.headers.get('authorization') || 
                         request.headers.get('x-payment') || '';

    if (!paymentHeader.toLowerCase().includes('paid')) {
      return NextResponse.json({
        error: "402 Payment Required",
        payTo: process.env.PAY_TO_ADDRESS,
        amount: "0.005",
        currency: "USDC",
        network: "base-sepolia",
        description: "agentic.market /loop"
      }, { status: 402, headers: corsHeaders() });
    }

    // ... rest of your existing loop logic (LLM, memory, actions, etc.)
    // (keep the full logic from previous version)
  } catch (error) {
    // error handling
  }
}
