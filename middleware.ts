import { paymentMiddleware } from '@x402/next';

const PAYMENT_ADDRESS = "0x8A9F22f8e8C9B9699e5DDd0B999C0EbA3245b25F"; // Your seller wallet

export const middleware = paymentMiddleware(PAYMENT_ADDRESS, {
  '/api/loop': {
    price: '0.005',                    // $0.005 USDC per loop
    network: 'base',
    config: {
      description: 'Attestify OS Full Memory-First Loop',
    }
  }
});

export const config = {
  matcher: ['/api/loop'],
};
