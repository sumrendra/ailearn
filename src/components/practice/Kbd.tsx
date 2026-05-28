/**
 * Mono key-cap badge. Used inline next to the rating buttons and as the
 * "1-4" prefix on answer options. Sized small (18px square) so it reads as
 * an affordance, not a label.
 */
export function Kbd({ children, tint }: { children: React.ReactNode; tint?: string }) {
  return (
    <kbd
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 20,
        height: 20,
        padding: "0 5px",
        borderRadius: 5,
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        fontWeight: 500,
        fontVariantNumeric: "tabular-nums",
        color: tint ?? "var(--text-secondary)",
        background: "var(--bg-overlay)",
        border: "1px solid var(--border-subtle)",
        lineHeight: 1,
      }}
    >
      {children}
    </kbd>
  );
}
