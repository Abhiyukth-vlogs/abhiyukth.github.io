## 2025-05-10 - Endpoint Caching Resiliency in Polling Loops
**Learning:** When caching a working endpoint in a multi-endpoint fallback polling loop to eliminate latency, failure to reset `workingEndpoint = null` on error causes permanent lock-in if the cached endpoint goes down later.
**Action:** Always ensure cached fallback endpoints reset to `null` on request failure so subsequent cycles can discover other working fallback endpoints.
