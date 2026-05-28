"use client";

import { lazy, Suspense, useMemo } from "react";
import { getPathMeta } from "@/lib/learning-paths";

/**
 * Safe wrapper around `@/components/path-objects`. That module is authored by
 * a parallel agent and may not exist at typecheck/build time. We dynamic-
 * import it via `lazy(() => …)` wrapped in an error boundary; if the import
 * resolves to a real component it renders; otherwise we fall back to a
 * path-tinted mini-mesh that still gives the hero its generative right rail.
 *
 * This component intentionally does NOT type-import from path-objects, so
 * the file compiles cleanly even before the sibling agent has shipped.
 */

// Lazy reference, declared once. The factory swallows resolution errors and
// resolves to a fallback module whose default export is null — so React
// reaches our `<Fallback />` via the Suspense/ErrorBoundary path.
const LazyPathObject = lazy(async () => {
  try {
    // The path is intentionally a runtime string so missing module errors
    // surface at render-time (caught by the boundary), not at module-eval.
    const mod = (await import(
      /* webpackIgnore: true */ "@/components/path-objects"
    )) as { PathObject?: React.ComponentType<{ slug: string }> };
    if (mod?.PathObject) {
      const C = mod.PathObject;
      return { default: C };
    }
    return { default: NullObject };
  } catch {
    return { default: NullObject };
  }
});

function NullObject(): React.ReactElement | null {
  // Throwing here would surface to the error boundary; returning null lets
  // React render nothing and the parent's `<Fallback />` sibling does the
  // visual work via CSS positioning.
  return null;
}

interface Props {
  slug: string;
  /** Approximate render size (square). Defaults to 360. */
  size?: number;
}

export function PathObjectSafe({ slug, size = 360 }: Props) {
  const meta = useMemo(() => getPathMeta(slug), [slug]);

  return (
    <div
      aria-hidden
      style={{
        position: "relative",
        width: "100%",
        maxWidth: size,
        aspectRatio: "1 / 1",
        // Path-tint scoped to this subtree so the fallback mesh inherits it.
        ["--path-color" as string]: meta.color,
        ["--path-tint" as string]: meta.tint,
      }}
    >
      {/* Fallback layer — always rendered, sits behind any real path-object.
       * If the real component mounts it covers this; if not, this IS the
       * visual. Either way the right rail is never empty. */}
      <Fallback slug={slug} />

      <Suspense fallback={null}>
        <div style={{ position: "absolute", inset: 0 }}>
          <LazyPathObject slug={slug} />
        </div>
      </Suspense>
    </div>
  );
}

/**
 * Path-tinted mini canvas-mesh. Mirrors `.canvas-mesh` from globals.css but
 * is scoped to its bounding box (not fixed/full-viewport) and biases the
 * gradient toward the path's color via `--path-color`.
 */
function Fallback({ slug }: { slug: string }) {
  const meta = getPathMeta(slug);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: "var(--radius-2xl, 24px)",
        overflow: "hidden",
        // Hairline border so the rail has presence even pre-import.
        border: "1px solid var(--border-subtle)",
        background: "var(--bg-elevated)",
        boxShadow: `inset 0 1px 0 var(--hairline-top)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "-30%",
          filter: "blur(60px) saturate(150%)",
          opacity: 0.65,
          background: `
            radial-gradient(50% 50% at 30% 28%, ${meta.color} 0%, transparent 60%),
            radial-gradient(45% 45% at 78% 22%, var(--mesh-teal) 0%, transparent 60%),
            radial-gradient(55% 55% at 72% 78%, ${meta.color} 0%, transparent 60%),
            radial-gradient(40% 40% at 22% 82%, var(--mesh-violet) 0%, transparent 60%)
          `,
          animation: "mesh-drift 40s ease-in-out infinite",
        }}
      />
      {/* Hairline ring + faint inner glow so the rail still reads as a
       * deliberate object, not an empty card, when the real motif is absent. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          boxShadow: `0 0 80px ${meta.glow} inset`,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
