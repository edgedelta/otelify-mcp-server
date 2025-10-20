# Otelify MCP Server

An MCP server that guides you through instrumenting an application with OpenTelemetry ("Otelify your apps") and streaming logs, metrics, and traces to Edge Delta.

## Quick Start

1. **Configure your MCP client**

   Add the server to your `.cursor/mcp.json` (replace the URL if you run locally):

   ```json
   {
     "mcpServers": {
       "otelify-your-apps": {
         "url": "https://<your-deployment>/api/mcp"
       }
     }
   }
   ```

2. **Kick off the workflow**

   Open your editor's MCP command palette and run a prompt like:

   ```
   Otelify this service using the otelify-your-apps MCP server. Start by creating the checklist.
   ```

   The default workflow:

   - Downloads `OTELIFY_CHECKLIST.md`
   - Generates a first-step instrumentation plan tailored to your stack
   - Provides the final Edge Delta endpoint configuration

## Available Tools

| Tool | Purpose |
| --- | --- |
| `create-checklist` | Downloads `OTELIFY_CHECKLIST.md`, the canonical step-by-step guide. |
| `generate-first-step-plan` | Produces a targeted plan for the first phase of instrumentation (Phase 2). Accepts optional metadata like service name, language, framework, and data stores. |
| `point-to-edge-delta` | Returns the instructions required to stream OTLP data to Edge Delta (endpoints, env vars, validation). |

## Local Development

```bash
bun install
bun run dev
```

Then point your MCP client at `http://localhost:3000/api/mcp`.

## Deployment Notes

- The checklist and supporting guides are served from API routes so you can host one deployment and keep the content in source control.
- Set `VERCEL_PROJECT_PRODUCTION_URL` (or equivalent) when deploying so download instructions reference the correct domain.

## License

MIT
