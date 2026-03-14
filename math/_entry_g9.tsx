import React from "react";
import { createRoot } from "react-dom/client";
import MathStudyG9 from "./FreeStudyLib";

class RootErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error("Grade 9 Math render failed:", error);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "24px",
          fontFamily: "system-ui, sans-serif",
          background: "#f6f7fb",
          color: "#0f172a"
        }}>
          <div style={{
            maxWidth: "680px",
            width: "100%",
            background: "#fff",
            border: "1px solid rgba(15,23,42,0.08)",
            borderRadius: "20px",
            padding: "24px",
            boxShadow: "0 18px 40px rgba(15,23,42,0.08)"
          }}>
            <h1 style={{ margin: "0 0 10px", fontSize: "1.4rem" }}>Grade 9 Math failed to load</h1>
            <p style={{ margin: "0 0 14px", lineHeight: 1.5, color: "rgba(15,23,42,0.72)" }}>
              The page hit a runtime error while rendering the new library. The error is shown below so it can be fixed directly.
            </p>
            <pre style={{
              margin: 0,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              background: "#f8fafc",
              borderRadius: "14px",
              padding: "14px",
              border: "1px solid rgba(148,163,184,0.25)",
              color: "#b91c1c",
              fontSize: "0.85rem"
            }}>
              {String(this.state.error?.message || this.state.error)}
            </pre>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const root = document.getElementById("root");
if (root) {
  root.textContent = "Loading Grade 9 Math...";
  createRoot(root).render(
    <React.StrictMode>
      <RootErrorBoundary>
        <MathStudyG9 />
      </RootErrorBoundary>
    </React.StrictMode>
  );
}
