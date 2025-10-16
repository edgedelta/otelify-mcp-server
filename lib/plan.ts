/**
 * Generates an actionable plan for the first round of OpenTelemetry instrumentation.
 */

export type FirstStepPlanInput = {
  serviceName?: string;
  language?: string;
  framework?: string;
  deployment?: string;
  prioritySignals?: string[];
  dataStores?: string[];
};

const DEFAULT_PRIORITY_SIGNALS = ["HTTP requests", "background jobs"];

export function generateFirstStepPlan({
  serviceName = "target service",
  language = "your language/runtime",
  framework,
  deployment = "primary deployment environment",
  prioritySignals = DEFAULT_PRIORITY_SIGNALS,
  dataStores = [],
}: FirstStepPlanInput): string {
  const frameworkLabel = framework ? ` (${framework})` : "";
  const signalList = prioritySignals.length
    ? prioritySignals.map((s) => `- ${s}`).join("\n")
    : DEFAULT_PRIORITY_SIGNALS.map((s) => `- ${s}`).join("\n");
  const dataStoreList = dataStores.length
    ? dataStores.map((d) => `- ${d}`).join("\n")
    : "- Document the primary datastore or external dependency";

  return `# First-Step Otelization Plan

Service: **${serviceName}**
Stack: **${language}${frameworkLabel}**
Target environment: **${deployment}**

## 1. Establish Observability Guardrails

1. Confirm the expected traffic path for ${serviceName} and capture an example request you can replay.
2. Decide the telemetry namespace values:
   - \`service.name\` = ${serviceName}
   - \`service.namespace\` = owning domain or team
   - \`deployment.environment\` = ${deployment}
3. Freeze current logging configuration for reference (existing loggers, formats, sinks).
4. List the first critical signal pathways to cover:
${signalList}

## 2. Bootstrap OpenTelemetry Runtime

1. Add the core OpenTelemetry SDK, auto-instrumentation agent (if available for ${language}), and OTLP exporters.
2. Create \`otel/bootstrap\` module that:
   - Registers resource attributes with \`service.name\` and team metadata.
   - Configures the tracer provider with batch span processor + OTLP exporter (HTTP or gRPC).
   - Registers metric reader/exporter pair (periodic reader + OTLP exporter).
   - Enables log bridge/exporter so logs can flow through OTLP as well as existing sinks.
3. Wire the bootstrap module into the process entrypoint (for ${framework || language}, load it before the framework initializes).

## 3. Instrument Critical Request Path

1. Wrap inbound request handling with middleware that starts a root span (HTTP server span) and records HTTP attributes.
2. Propagate context to downstream calls:
   - Add instrumentation for ${framework || language} HTTP clients or gRPC clients.
   - Ensure propagation headers (traceparent, tracestate, baggage) are forwarded.
3. Record application-specific span attributes (tenant, feature flag, user id hash) using safe PII practices.
4. Emit structured logs through the OpenTelemetry logger with trace/span ids attached.

## 4. Metrics Quick Wins

1. Register a counter for successful requests and another for failed requests (label by status class).
2. Record latency via a histogram (bucket boundaries tuned for your SLO).
3. Capture infrastructure signals that already exist (CPU, memory) by scraping from runtime/host collectors, or expose them via OTEL metrics if absent.
4. Tag metrics with dimensions that Edge Delta analytics will need (environment, region, commit sha).

## 5. Data Store Touchpoints

Instrument the first datastore interactions to close trace gaps:
${dataStoreList}

- Wrap the datastore client with trace spans named \`db.${serviceName}\`.
- Add span events for slow queries or retries.
- Emit query/operation metrics where useful (cardinality controlled).

## 6. Local Validation Loop

1. Run a local or staging instance with OTEL exporting to a throwaway collector (point \`OTEL_EXPORTER_OTLP_ENDPOINT\` to \`http://localhost:4318\`).
2. Replay the captured request and confirm:
   - Trace spans appear with expected hierarchy.
   - Metrics contain correct service metadata.
   - Logs include trace/span ids and enriched fields.
3. Fix any missing propagation (look for spans marked as root when they should be children).

## 7. Exit Criteria For Phase 2

- Application boots with OpenTelemetry enabled and no startup errors.
- Inbound request path emits trace + log + metric for the happy path and error path.
- Telemetry volume is within expected cardinality limits.
- Documentation exists for toggling instrumentation on/off via environment variables.

Once these items are complete, move to Phase 3 for broader coverage and prepare to connect to Edge Delta.`;
}
