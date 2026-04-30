import { NextResponse } from 'next/server';
import { createPaymentHandler } from '@x402/next';   // New import

// Your payment config
const paymentHandler = createPaymentHandler({
  payee: "0x8A9F22f8e8C9B9699e5DDd0B999C0EbA3245b25F", // Your seller wallet
  price: 0.005,  // $0.005 USDC
  network: 'base',
  description: 'Attestify OS Full Memory-First Loop',
});

export async function POST(request) {
  // First, handle payment
  const paymentResult = await paymentHandler(request);
  if (!paymentResult.success) {
    return NextResponse.json(paymentResult.error, { 
      status: paymentResult.status || 402 
    });
  }

  try {
    const body = await request.json();
    const { session_id, input, proposed_actions = [] } = body;

    if (!session_id || !input) {
      return NextResponse.json({ error: "Missing session_id or input" }, { status: 400 });
    }

    const loopResult = {
      status: "success",
      paid: true,
      session_id,
      memory_context: "Memory stub — coming next",
      cost_estimate: "0.004 USDC",
      safe_actions: proposed_actions,
      message: "✅ x402 payment received + Full loop executed!",
      loop_id: "loop-" + Date.now(),
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(loopResult);
  } catch (error) {
    return NextResponse.json({ 
      error: "Server error", 
      message: error.message 
    }, { status: 500 });
  }
}
