// app/api/agents/register/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { agent_id, name, system_prompt, price_per_loop, owner } = await request.json();

  // TODO: Save to Redis or DB
  return NextResponse.json({
    success: true,
    agent: { agent_id, name, system_prompt, price_per_loop, owner }
  });
}
