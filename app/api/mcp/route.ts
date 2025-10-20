/**
 * Otelify MCP server.
 *
 * Tools:
 * 1. create-checklist - Provides instructions to download the Otelify checklist.
 * 2. generate-first-step-plan - Returns a plan tailored to the service's first instrumentation step.
 * 3. point-to-edge-delta - Guides the user to stream telemetry to Edge Delta.
 */

import { z } from "zod";
import { createMcpHandler } from "mcp-handler";
import { generateFirstStepPlan } from "@/lib/plan";
import { generateEdgeDeltaGuide } from "@/lib/edge-delta";

const handler = createMcpHandler(
  (server) => {
    server.tool(
      "create-checklist",
      "Creates an Otelify checklist in the repository by downloading the canonical markdown file. Check if OTELIFY_CHECKLIST.md exists first.",
      {},
      async () => {
        const checklistPath = "OTELIFY_CHECKLIST.md";
        const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
          ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
          : "http://localhost:3000";
        const apiUrl = `${baseUrl}/api/checklist`;

        return {
          content: [
            {
              type: "text" as const,
              text: `📋 Otelify Checklist Instructions

TARGET FILE: ${checklistPath}

STEP 1 — SAFETY CHECK
1. Use read_file to see if ${checklistPath} already exists.
2. If it exists, confirm with the user before overwriting to avoid losing progress.

STEP 2 — DOWNLOAD THE CHECKLIST
Run:
\`\`\`bash
curl -s "${apiUrl}" -o "${checklistPath}"
\`\`\`

This fetches the canonical Otelify checklist covering logs, metrics, traces, and the Edge Delta rollout.

STEP 3 — VERIFY
Immediately read ${checklistPath} to confirm it was saved. Summarize the next actions for the user.

WORKING AGREEMENTS
- Treat the checklist as the source of truth for progress.
- Update the markdown after completing each task by changing \`- [ ]\` to \`- [x]\`.
- Use the \`generate-first-step-plan\` tool before starting Phase 2.
- When ready for Edge Delta integration, call \`point-to-edge-delta\` for the latest endpoint guidance.

Ready to Otelify!`,
            },
          ],
        };
      }
    );

    server.tool(
      "generate-first-step-plan",
      "Returns a tailored plan for the first round of OpenTelemetry instrumentation (Phase 2 of the checklist).",
      {
        serviceName: z
          .string()
          .optional()
          .describe("Service or workload name (e.g., payments-api)."),
        language: z
          .string()
          .optional()
          .describe("Primary language/runtime (e.g., Go 1.22, Node.js 20)."),
        framework: z
          .string()
          .optional()
          .describe("Optional framework or library (e.g., Spring Boot, Express)."),
        deployment: z
          .string()
          .optional()
          .describe("Deployment target or environment (e.g., prod-us-west)."),
        prioritySignals: z
          .array(z.string())
          .optional()
          .describe("Specific signal pathways that must be instrumented first."),
        dataStores: z
          .array(z.string())
          .optional()
          .describe("Primary datastores or external systems touched by the service."),
      },
      async (args) => {
        const plan = generateFirstStepPlan({
          serviceName: args.serviceName ?? undefined,
          language: args.language ?? undefined,
          framework: args.framework ?? undefined,
          deployment: args.deployment ?? undefined,
          prioritySignals: args.prioritySignals ?? undefined,
          dataStores: args.dataStores
            ? args.dataStores.map((item) =>
                item.startsWith("-") ? item : `- ${item}`
              )
            : undefined,
        });

        return {
          content: [
            {
              type: "text" as const,
              text: plan,
            },
          ],
        };
      }
    );

    server.tool(
      "point-to-edge-delta",
      "Provides the steps required to send OTLP data to Edge Delta, including endpoints, environment variables, and validation tasks.",
      {
        deployment: z
          .string()
          .optional()
          .describe(
            "Deployment target (production, staging, or custom string for context)."
          ),
        protocol: z
          .enum(["grpc", "http"])
          .optional()
          .describe("Preferred OTLP transport protocol (grpc or http)."),
      },
      async (args) => {
        const guide = generateEdgeDeltaGuide({
          deployment: args.deployment ?? undefined,
          protocol: args.protocol ?? undefined,
        });

        return {
          content: [
            {
              type: "text" as const,
              text: guide,
            },
          ],
        };
      }
    );
  },
  {
    serverInfo: {
      name: "otelify-your-apps",
      version: "1.0.0",
    },
    capabilities: {
      tools: {},
    },
  },
  {
    basePath: "/api",
    verboseLogs: process.env.NODE_ENV === "development",
    maxDuration: 60,
  }
);

export { handler as GET, handler as POST, handler as DELETE };
