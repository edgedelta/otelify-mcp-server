import { generateChecklist } from "./checklist";
import { generateFirstStepPlan } from "./plan";
import { generateEdgeDeltaGuide } from "./edge-delta";

function assert(condition: unknown, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

const checklist = generateChecklist();
assert(
  checklist.includes("Phase 5 — Stream Telemetry To Edge Delta"),
  "Checklist should mention streaming to Edge Delta"
);

const plan = generateFirstStepPlan({
  serviceName: "payments-api",
  language: "Go 1.22",
  framework: "Echo",
  deployment: "prod-us-west",
  prioritySignals: ["HTTP gateway", "Worker queue"],
  dataStores: ["- PostgreSQL (transactions)", "- Redis (session cache)"],
});
assert(
  plan.includes("payments-api"),
  "First-step plan should include custom service name"
);

const guide = generateEdgeDeltaGuide({ deployment: "staging", protocol: "http" });
assert(
  guide.includes("https://otel.staging.edgedelta.com"),
  "Edge Delta guide should reflect staging HTTP endpoint"
);

console.log("All content generation tests passed.");
