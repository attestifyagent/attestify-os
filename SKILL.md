# Attestify OS /loop

**Memory-First Persistent Agent Execution Loop**

A production-grade, stateful agent infrastructure with persistent memory, real Grok intelligence, and native x402 micropayments.

**Endpoint**  
`POST https://attestify-os.vercel.app/api/loop`

**Payment**  
0.005 USDC per loop (x402 standard)

**Key Features**
- Persistent memory across multi-turn conversations (Redis-backed)
- Real Grok (xAI) LLM responses
- Agent registry with custom system prompts
- Action simulation & sandboxing
- Rate limiting & CORS support

**Example Request**
```json
{
  "session_id": "conv-123",
  "input": "Tell me a joke about agents",
  "agent_id": "comedian-v1",
  "proposed_actions": ["search_web"]
}
Response Example
JSON{
  "status": "success",
  "paid": true,
  "session_id": "conv-123",
  "output": "Why did the AI agent go broke? ...",
  "cost_estimate": "0.005 USDC"
}
