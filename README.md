# Attestify OS

**Unified x402 Agent Operating System** — Memory-first full loop for production agents.

Combines:
- Persistent / Shared Memory
- Real-time Cost Control + Budget Guardrails
- Secure Execution Sandbox
- Multi-Agent Orchestration
- Built-in Attestify verification (optional)

**Live soon:** `https://attestify-os.vercel.app`

## Quick Start (for agents)

```js
// Example full-loop call
const response = await fetch('https://attestify-os.vercel.app/api/loop', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    session_id: "agent-123",
    input: "User query here...",
    proposed_actions: [...]
  })
});
