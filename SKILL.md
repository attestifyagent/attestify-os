# Attestify OS /loop

**Memory-First Agent Execution Loop**

A production-grade, persistent memory loop for AI agents.

**Endpoint**: `POST https://attestify-os.vercel.app/api/loop`

**Payment**: 0.005 USDC per loop (x402)

**Capabilities**:
- Persistent conversation memory across turns
- Real Grok LLM (xAI)
- Agent registry with custom system prompts
- Action simulation & sandboxing
- Multi-agent handoff support

**Example Usage**:
```json
{
  "session_id": "conv-123",
  "input": "Tell me a joke about agents",
  "agent_id": "comedian-v1"
}
