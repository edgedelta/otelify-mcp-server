/**
 * API endpoint to generate the Otelize checklist.
 */

import { generateChecklist } from "@/lib/checklist";

export async function GET() {
  return new Response(generateChecklist(), {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
