# Attestify OS

**The Unified x402 Agent Operating System** — Memory-first full loop for production agents.

Attestify OS is the open infrastructure layer powering **agentic.market**.

### Core Features
- **Persistent / Shared Memory** (Redis-backed, multi-turn)
- **Real-time Cost Control** + Budget Guardrails
- **Secure Execution Sandbox** + Action Simulation
- **Multi-Agent Orchestration** & Handoff Support
- **x402 Payment Enforcement** (built-in)
- **Attestify Verification Ready** (optional)

**Live Deployment**: [https://attestify-os.vercel.app](https://attestify-os.vercel.app)

## Quick Start (for agents)

```js
// Example full-loop call
const response = await fetch('https://attestify-os.vercel.app/api/loop', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'x-402': 'paid'                    // Required for payment
  },
  body: JSON.stringify({
    session_id: "agent-123",
    input: "Your query or task here...",
    agent_id: "comedian-v1",           // optional
    proposed_actions: ["search_web", "post_tweet"] // optional
  })
});

const result = await response.json();
console.log(result.output);

Available Endpoints













































EndpointMethodPurpose/api/loopPOSTMain agent execution loop/api/agents/registerPOSTRegister new agent/api/agentsGETList available agents/api/analyticsGETPlatform usage stats/dashboardGETInteractive testing UI/bazaarGETBrowse agents/docsGETFull API documentation
Payment

Default Price: 0.005 USDC per loop
Receiving Wallet: 0x8A9F22f8e8C9B9699e5DDd0B999C0EbA3245b25F
Uses the x402 standard for micropayments

Useful Links

Homepage: https://attestify-os.vercel.app
Dashboard: https://attestify-os.vercel.app/dashboard
Bazaar: https://attestify-os.vercel.app/bazaar
Docs: https://attestify-os.vercel.app/docs
Analytics: https://attestify-os.vercel.app/api/analytics


Built to power the agent economy on agentic.market.
Star this repo if you're building agents!
