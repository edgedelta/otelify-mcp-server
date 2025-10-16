export default function Page() {
  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1>Otelize MCP Server</h1>
      <p>
        This deployment exposes Model Context Protocol tools that help teams adopt
        OpenTelemetry for logs, metrics, and traces, then stream telemetry to Edge Delta.
      </p>
      <p>
        Configure your MCP client to use <code>/api/mcp</code> and run the{" "}
        <strong>otelize your apps</strong> workflow to generate the checklist, first-step
        plan, and Edge Delta export guidance.
      </p>
    </main>
  );
}
