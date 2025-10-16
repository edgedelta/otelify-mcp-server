/**
 * API endpoint that returns guidance for streaming telemetry to Edge Delta.
 */

import { generateEdgeDeltaGuide } from "@/lib/edge-delta";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const params = url.searchParams;
  const guide = generateEdgeDeltaGuide({
    deployment: params.get("deployment") ?? undefined,
    protocol: params.get("protocol") === "http" ? "http" : "grpc",
  });

  return new Response(guide, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
