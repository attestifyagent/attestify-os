# Attestify OS /loop

**Memory-First Persistent Agent Execution Loop**

A production-grade loop with persistent memory, real Grok LLM, and x402 payments.

**Endpoint**: `POST https://attestify-os.vercel.app/api/loop`

**Payment**: 0.005 USDC per loop (x402)

**Capabilities**:
- Persistent conversation memory across turns
- Real Grok (xAI) intelligence
- Agent registry with custom system prompts
- Action simulation
- Multi-turn support

**Example Request**:
```json
{
  "session_id": "conv-123",
  "input": "Tell me a joke about agents",
  "agent_id": "comedian-v1"
}
