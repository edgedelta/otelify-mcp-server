"use client";

import { useState } from "react";

export default function Page() {
  const [copiedConfig, setCopiedConfig] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const mcpConfig = `"mcpServers": {
  "otelize-your-apps": {
    "url": "https://otelize.mcp.edgedelta.com/api/mcp"
  }
}`;

  const promptText = "Instrument open telemetry for this service using the otelize MCP server.";

  const handleCopyConfig = async () => {
    await navigator.clipboard.writeText(mcpConfig);
    setCopiedConfig(true);
    setTimeout(() => setCopiedConfig(false), 2000);
  };

  const handleCopyPrompt = async () => {
    await navigator.clipboard.writeText(promptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <main style={{
      padding: "3rem 2rem",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
      maxWidth: "1200px",
      margin: "0 auto",
      backgroundColor: "#fafafa",
      minHeight: "100vh"
    }}>
      <h1 style={{
        fontSize: "3rem",
        fontWeight: "700",
        marginBottom: "1rem",
        color: "#000"
      }}>
        Otelize MCP Server
      </h1>
      <p style={{
        fontSize: "1.125rem",
        lineHeight: "1.7",
        marginBottom: "2.5rem",
        color: "#000"
      }}>
        This deployment exposes Model Context Protocol tools that help teams adopt
        OpenTelemetry for logs, metrics, and traces, then stream telemetry to Edge Delta.
      </p>

      <h2 style={{
        fontSize: "2rem",
        fontWeight: "700",
        marginBottom: "1rem",
        marginTop: "2.5rem",
        color: "#000"
      }}>
        Setup Instructions
      </h2>
      <p style={{
        fontSize: "1.125rem",
        lineHeight: "1.7",
        marginBottom: "1.5rem",
        color: "#000"
      }}>
        Add the following configuration to your MCP client settings (e.g., Claude Desktop config):
      </p>

      <div style={{ position: "relative", marginBottom: "2.5rem" }}>
        <pre
          style={{
            background: "#f5f5f5",
            padding: "1.5rem",
            borderRadius: "8px",
            overflow: "auto",
            border: "1px solid #e0e0e0",
            fontSize: "0.95rem",
            lineHeight: "1.6",
            fontFamily: "'Monaco', 'Menlo', 'Ubuntu Mono', monospace"
          }}
        >
          <code>{mcpConfig}</code>
        </pre>
        <button
          onClick={handleCopyConfig}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            padding: "0.5rem 1.25rem",
            background: copiedConfig ? "#4caf50" : "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "0.9rem",
            fontWeight: "500",
            transition: "all 0.2s"
          }}
        >
          {copiedConfig ? "Copied!" : "Copy"}
        </button>
      </div>

      <h2 style={{
        fontSize: "2rem",
        fontWeight: "700",
        marginBottom: "1rem",
        marginTop: "2.5rem",
        color: "#000"
      }}>
        Usage
      </h2>
      <p style={{
        fontSize: "1.125rem",
        lineHeight: "1.7",
        marginBottom: "1.5rem",
        color: "#000"
      }}>
        Once configured, open your MCP client (e.g., Claude Desktop) and send the following prompt:
      </p>
      <div style={{ position: "relative", marginBottom: "1.5rem" }}>
        <pre
          style={{
            background: "#f5f5f5",
            padding: "1.5rem",
            borderRadius: "8px",
            overflow: "auto",
            border: "1px solid #e0e0e0",
            fontSize: "0.95rem",
            lineHeight: "1.6",
            fontFamily: "'Monaco', 'Menlo', 'Ubuntu Mono', monospace"
          }}
        >
          <code>{promptText}</code>
        </pre>
        <button
          onClick={handleCopyPrompt}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            padding: "0.5rem 1.25rem",
            background: copiedPrompt ? "#4caf50" : "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "0.9rem",
            fontWeight: "500",
            transition: "all 0.2s"
          }}
        >
          {copiedPrompt ? "Copied!" : "Copy"}
        </button>
      </div>
      <p style={{
        fontSize: "1.125rem",
        lineHeight: "1.7",
        marginBottom: "0.75rem",
        color: "#000"
      }}>
        This will generate:
      </p>
      <ul style={{
        fontSize: "1.125rem",
        lineHeight: "1.9",
        marginLeft: "1.5rem",
        color: "#000"
      }}>
        <li>A comprehensive OpenTelemetry adoption checklist</li>
        <li>First-step implementation plan tailored to your stack</li>
        <li>Edge Delta export configuration guidance</li>
      </ul>
    </main>
  );
}
