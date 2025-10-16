/**
 * Provides guidance on directing OpenTelemetry data to Edge Delta.
 */

export type EdgeDeltaOptions = {
  deployment?: string;
  protocol?: "grpc" | "http";
};

const DEFAULT_ENDPOINTS: Record<string, { grpc: string; http: string }> = {
  production: {
    grpc: "otel.ingest.edgedelta.com:443",
    http: "https://otel.ingest.edgedelta.com",
  },
  staging: {
    grpc: "otel.staging.edgedelta.com:443",
    http: "https://otel.staging.edgedelta.com",
  },
};

export function generateEdgeDeltaGuide({
  deployment = "production",
  protocol = "grpc",
}: EdgeDeltaOptions = {}): string {
  const endpointRecord =
    DEFAULT_ENDPOINTS[deployment.toLowerCase()] ?? DEFAULT_ENDPOINTS.production;
  const endpoint =
    protocol === "http" ? endpointRecord.http : endpointRecord.grpc;

  return `# Stream OpenTelemetry Signals To Edge Delta

Deployment target: **${deployment}**
Protocol: **${protocol.toUpperCase()}**
Endpoint to configure: **${endpoint}**

## 1. Prerequisites

- Edge Delta account with access to the OpenTelemetry ingest pipeline.
- API token or mTLS certificate bundle provisioned for the service.
- OpenTelemetry Collector or in-process OTLP exporter reachable from the service.
- Network rules opened so the service or collector can reach Edge Delta over port 4317 (gRPC) or 4318 (HTTP).

## 2. Configure Environment Variables

\`\`\`bash
export OTEL_SERVICE_NAME=\"${deployment}-service\"       # override with service.name
export OTEL_RESOURCE_ATTRIBUTES=\"service.namespace=team,service.version=$(git rev-parse --short HEAD)\"
export OTEL_EXPORTER_OTLP_PROTOCOL=${protocol === "http" ? "http/protobuf" : "grpc"}
export OTEL_EXPORTER_OTLP_ENDPOINT=\"${endpoint}\"
export OTEL_EXPORTER_OTLP_HEADERS=\"ed-api-key=<EDGE_DELTA_API_TOKEN>\"
\`\`\`

For collectors running as sidecars or DaemonSets, inject these values into the collector config instead of the application.

## 3. Collector Pipeline Snippet

\`\`\`yaml
receivers:
  otlp:
    protocols:
      grpc:
      http:

exporters:
  otlp/edgedelta:
    endpoint: ${endpoint}
    tls:
      insecure_skip_verify: false
    headers:
      ed-api-key: \${EDGE_DELTA_API_TOKEN}

service:
  pipelines:
    traces:
      receivers: [otlp]
      exporters: [otlp/edgedelta]
    metrics:
      receivers: [otlp]
      exporters: [otlp/edgedelta]
    logs:
      receivers: [otlp]
      exporters: [otlp/edgedelta]
\`\`\`

## 4. Validation Checklist

- Deploy the configuration to a staging environment.
- Generate test traffic and confirm Edge Delta dashboards show traces, metrics, and logs.
- Verify Edge Delta automatically groups signals by \`service.namespace\`, \`service.name\`, and \`deployment.environment\`.
- Monitor exporter metrics (\`otlp_exporter_* \`) for queue length, retries, and dropped spans.
- Enable alerting in Edge Delta for ingestion failures or high error rates.

## 5. Production Cutover Steps

1. Promote the validated configuration to production via infrastructure-as-code or configuration management.
2. Rotate Edge Delta tokens following company security policy.
3. Update runbooks with the Edge Delta ingestion endpoint and troubleshooting steps.
4. Schedule a post-cutover review after 24 hours to confirm sustained telemetry flow.

Once these steps are completed, ${deployment} traffic will stream to Edge Delta.`;
}
