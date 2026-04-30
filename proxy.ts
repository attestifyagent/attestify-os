import { paymentProxy } from '@x402/next';

const PAYMENT_ADDRESS = "0x8A9F22f8e8C9B9699e5DDd0B999C0EbA3245b25F"; // ←

export const proxy = paymentProxy(PAYMENT_ADDRESS, {
  '/api/loop': {
    price: 0.005,                    // $0.005 USDC per full loop
    network: 'base',
    description: 'Attestify OS Full Memory-First Loop',
    maxTimeoutSeconds: 30,
  },
});

export const config = {
  matcher: ['/api/loop'],
};
