/**
 * CanvasBackdrop — the always-on atmospheric layer that sits behind every
 * page in the redesigned AILearn. Two layers:
 *
 *   1. `.canvas-mesh` — drifting gradient mesh (40s loop)
 *   2. `.canvas-grain` — animated film grain (8s loop, mix-blend overlay)
 *
 * Both layers are CSS-only and respect `prefers-reduced-motion`. They sit
 * at `z-index: -2` and `-1` respectively, behind any content; the page's
 * dark `--bg-app` provides the canvas underneath.
 *
 * The `tint` prop biases the mesh's dominant gradient toward a per-path
 * color. Pages that aren't path-scoped should pass nothing and inherit
 * the default violet.
 *
 * Mounted ONCE in the app layout (and once in the auth layout) so every
 * route gets it for free. Don't drop this on individual pages.
 */
type Props = {
  /** Optional CSS color string (HSL recommended) to tint the mesh.
   *  e.g. the path's `meta.color` from learning-paths.ts. */
  tint?: string;
};

export function CanvasBackdrop({ tint }: Props) {
  return (
    <>
      <div
        className="canvas-mesh"
        // Override --path-tint on this element only, scoped to the mesh.
        style={tint ? ({ ["--path-tint" as string]: tint } as React.CSSProperties) : undefined}
        aria-hidden
      />
      <div className="canvas-grain" aria-hidden />
    </>
  );
}
