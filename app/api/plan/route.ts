/**
 * API endpoint to generate the first-step otelization plan.
 */

import { generateFirstStepPlan } from "@/lib/plan";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const params = url.searchParams;
  const plan = generateFirstStepPlan({
    serviceName: params.get("serviceName") ?? undefined,
    language: params.get("language") ?? undefined,
    framework: params.get("framework") ?? undefined,
    deployment: params.get("deployment") ?? undefined,
    prioritySignals: params.get("prioritySignals")
      ? params.get("prioritySignals")?.split(",").map((item) => item.trim())
      : undefined,
    dataStores: params.get("dataStores")
      ? params.get("dataStores")?.split(",").map((item) => `- ${item.trim()}`)
      : undefined,
  });

  return new Response(plan, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
