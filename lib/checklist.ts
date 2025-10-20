/**
 * Otelify checklist generator.
 * Produces the canonical Markdown file agents download before starting work.
 */

export function generateChecklist(): string {
  const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000";
  const firstStepPlanUrl = `${baseUrl}/api/plan`;
  const edgeDeltaGuideUrl = `${baseUrl}/api/edge-delta`;

  return `# Otelify Your Apps Checklist

Use this checklist to instrument your application with OpenTelemetry across logs, metrics, and traces, then stream data to Edge Delta.

## How To Work With This Checklist

- Treat every unchecked item as a blocking task. Update the file by changing \`- [ ]\` to \`- [x]\` as soon as you complete a task.
- Follow phases in order. Do not skip ahead; each phase builds on the previous one.
- Keep a running changelog in your commit description or notes file as you make changes.
- Use the \`generate-first-step-plan\` MCP tool (or download via \`curl ${firstStepPlanUrl}\`) before starting Phase 2 to tailor the first instrumentation step to this service.
- When you reach Phase 5, fetch detailed guidance for streaming to Edge Delta via \`curl ${edgeDeltaGuideUrl}\`.

---

## Phase 0 — Prerequisites & Alignment

- [ ] Confirm the service/stacks that must be instrumented first (service name, language/runtime, deployment target).
- [ ] Identify all existing logging, metrics, and tracing libraries currently in use.
- [ ] Verify you have access to deployment pipelines and environment variable management.
- [ ] Capture current observability gaps or SLO/SLA commitments that instrumentation must support.

## Phase 1 — OpenTelemetry Foundation

- [ ] Add OpenTelemetry SDK dependencies for the target language (core SDK, exporters, instrumentation packages, propagators).
- [ ] Establish a consistent resource schema (service.name, service.namespace, environment, version).
- [ ] Configure context propagation (W3C trace context, baggage).
- [ ] Create a bootstrap module that initializes the OTel SDK and registers signal pipelines.
- [ ] Decide on configuration strategy (env vars, config file, feature flags) and document defaults.

## Phase 2 — First-Step Instrumentation (Guided Plan Required)

- [ ] Use the \`generate-first-step-plan\` tool to retrieve an actionable plan that matches your stack.
- [ ] Implement the tasks outlined in the first-step plan (typically request/response tracing, inbound/outbound middleware, baseline metrics, and log enrichment).
- [ ] Add smoke tests or local demo flows to validate that traces, metrics, and logs emit sample data.
- [ ] Capture before/after snippets showing how instrumentation was added for documentation.

## Phase 3 — Deep Signal Coverage

- [ ] Expand tracing coverage to business-critical operations (database calls, queues, external APIs).
- [ ] Instrument key metrics (throughput, latency, error rates, resource utilization) using OTel instruments.
- [ ] Route structured logs through the OTel logger or connect existing loggers via OTel log bridge exporters.
- [ ] Add attributes and span events aligned to troubleshooting and SLO diagnostics.

## Phase 4 — Verification & Hardening

- [ ] Run the service locally with the OpenTelemetry collector/endpoint running in debug mode.
- [ ] Verify traces propagate across service boundaries and are sampled as expected.
- [ ] Validate metrics cardinality and ensure metric names follow OTel semantic conventions.
- [ ] Confirm logs include trace and span identifiers so they can be correlated downstream.
- [ ] Stress-test the service (or replay traffic) to observe exporter back-pressure and batching behaviour.
- [ ] Document runbooks for enabling/disabling instrumentation at runtime.

## Phase 5 — Stream Telemetry To Edge Delta

- [ ] Fetch the latest Edge Delta streaming instructions by calling the \`point-to-edge-delta\` tool or downloading \`curl ${edgeDeltaGuideUrl}\`.
- [ ] Configure the OpenTelemetry collector/exporter endpoint to use the Edge Delta OTLP ingest URL.
- [ ] Provide Edge Delta credentials (API token or mTLS bundle) via secure environment variables.
- [ ] Deploy a staging build with the Edge Delta endpoint configured and verify data appears in Edge Delta dashboards.
- [ ] Roll out the configuration to production; monitor ingestion metrics and alerts for 24 hours.
- [ ] Capture a screenshot or report from Edge Delta confirming logs, metrics, and traces are flowing.

## Phase 6 — Wrap-Up

- [ ] Remove any temporary debug logging or hard-coded endpoints used during rollout.
- [ ] Finalize documentation: architecture diagrams, configuration matrix, and data retention policies.
- [ ] Hand off ongoing operations guidance to the owning team (alerting thresholds, dashboards, runbooks).
- [ ] Create a follow-up backlog of advanced instrumentation (profiling, span links, exemplars) if needed.

Once all boxes are checked, your service is fully otelified and streaming telemetry to Edge Delta.`;
}
