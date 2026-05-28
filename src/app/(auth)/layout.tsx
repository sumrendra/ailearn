import { CanvasBackdrop } from "@/components/layout/CanvasBackdrop";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg-app)",
      position: "relative",
    }}>
      {/* Atmospheric backdrop for auth — login/signup are hero moments;
          mesh + grain make them feel like the front door of a premium app
          rather than a generic form page. */}
      <CanvasBackdrop />
      {children}
    </div>
  );
}
