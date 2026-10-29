---
name: freellmapi
description: >-
  Use this skill when configuring, deploying, connecting, or querying FreeLLMAPI
  (https://github.com/tashfeenahmed/freellmapi). FreeLLMAPI aggregates free tiers across
  34 LLM providers (635 free endpoints) into a single unified OpenAI-compatible /v1 endpoint,
  with automatic rate-limit failover, model routing, encrypted key storage, prompt compression,
  and Streamable HTTP MCP server support.
---

# FreeLLMAPI Guide & Reference

FreeLLMAPI aggregates 34 free LLM provider tiers (Groq, Gemini, Mistral, Cerebras, SambaNova, Together, Cohere, Cloudflare, DeepInfra, etc.) behind a single unified OpenAI-compatible API endpoint (`http://localhost:3001/v1`) with automatic rate-limit failover, model routing, encrypted credential storage, and context handoff.

---

## 1. Quick Start & Deployment Options

### Option A: Windows Desktop App
- Download the official `.exe` installer from [Releases](https://github.com/tashfeenahmed/freellmapi/releases/latest).
- Desktop app automatically signs in with a local account (no dashboard password required).
- Copy your unified API key (`freellmapi-...`) from the system tray popover or the **Keys** dashboard.
- Default endpoint: `http://127.0.0.1:31415/v1` or `http://localhost:3001/v1`.

### Option B: Docker Compose (Recommended for Containers)
```powershell
git clone https://github.com/tashfeenahmed/freellmapi.git
cd freellmapi

$Bytes = New-Object Byte[] 32
[Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($Bytes)
$ENCRYPTION_KEY = -join ($Bytes | ForEach-Object { "{0:x2}" -f $_ })
"ENCRYPTION_KEY=$ENCRYPTION_KEY`nPORT=3001" | Out-File -Encoding utf8 .env
docker compose up -d
```
- Open `http://localhost:3001` to add provider API keys and copy the unified API key.

### Option C: One-Liner (macOS / Linux / WSL)
```bash
curl -fsSL https://freellmapi.co/install.sh | bash
```

---

## 2. Using with AI Clients & SDKs

Point standard OpenAI SDKs or clients at your local FreeLLMAPI instance:

| Parameter | Value |
| :--- | :--- |
| **Base URL** | `http://localhost:3001/v1` (Note: Claude Code uses root `http://localhost:3001`) |
| **API Key** | Your unified key (`freellmapi-...` from dashboard or tray) |
| **Default Model** | `freellmapi/auto` (or explicit IDs e.g. `groq/llama-3.3-70b-versatile`, `google/gemini-2.0-flash`) |

### OpenAI Python SDK Example:
```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:3001/v1",
    api_key="freellmapi-your-unified-key"
)

response = client.chat.completions.create(
    model="freellmapi/auto",
    messages=[{"role": "user", "content": "Hello via FreeLLMAPI!"}]
)
print(response.choices[0].message.content)
```

### OpenAI Node.js / JavaScript Example:
```javascript
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'http://localhost:3001/v1',
  apiKey: 'freellmapi-your-unified-key'
});

const completion = await openai.chat.completions.create({
  model: 'freellmapi/auto',
  messages: [{ role: 'user', content: 'Explain quantum computing in one sentence.' }]
});
console.log(completion.choices[0].message.content);
```

---

## 3. Automated Setup for Coding Agents

FreeLLMAPI includes CLI generators to configure popular coding tools without manual file editing:

```bash
# Set your unified key in environment
export FREELLMAPI_API_KEY="freellmapi-your-unified-key"

# Configure Claude Code
npx freellmapi setup-claude --url http://localhost:3001

# Configure Cline
npx freellmapi setup-cline --url http://localhost:3001/v1

# Configure Continue (Autocomplete & Chat)
npx freellmapi setup-continue --url http://localhost:3001/v1

# Configure Aider
npx freellmapi setup-aider --url http://localhost:3001/v1

# Configure OpenCode
npx freellmapi setup-opencode --url http://localhost:3001/v1

# Configure Codex CLI
npx freellmapi setup-codex --url http://localhost:3001/v1

# Configure Roo Code
npx freellmapi setup-roo --url http://localhost:3001/v1

# Print config snippet for any other tool
npx freellmapi setup-generic --url http://localhost:3001/v1
```

---

## 4. Connecting FreeLLMAPI via MCP (Model Context Protocol)

FreeLLMAPI provides a Streamable HTTP MCP server at `http://localhost:3001/mcp`.

### MCP Tools Available:
1. `ask_freellmapi`: Run inference queries routed across all enabled free providers with automatic failover.
2. `list_models`: View active models, context windows, and availability.
3. `healthcheck`: Verify gateway connectivity and active provider routes.

### Configuration for Gemini / Antigravity / Claude Code / Cursor:
Add to your client's MCP settings:
```json
{
  "mcpServers": {
    "freellmapi": {
      "command": "npx",
      "args": ["mcp-remote", "http://localhost:3001/mcp"],
      "env": {
        "FREELLMAPI_MCP_AUTHORIZATION": "Bearer freellmapi-your-unified-key"
      }
    }
  }
}
```

---

## 5. Key Architecture Features

- **Fallback Chain**: If Provider A hits a rate limit (HTTP 429) or error (HTTP 5xx), the proxy automatically falls over to Provider B, then Provider C, invisibly to the client.
- **Context Handoff**: Injects an invisible, concise system prompt when a switch occurs mid-conversation so the new model seamlessly continues the user's task.
- **Usage & Quota Tracker**: Tracks per-key token counts and requests per minute (RPM) to prevent exceeding free-tier caps.
- **Prompt Compression Pipeline**: Compresses conversational context by up to 40% before dispatching to upstream providers, saving free-tier tokens.
- **Encrypted Storage**: Provider API keys are stored encrypted at rest in local SQLite (`freeapi.db`) using AES-256-GCM.
