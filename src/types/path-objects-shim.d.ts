/**
 * Ambient shim for `@/components/path-objects`.
 *
 * That module is authored by a parallel agent and may not exist in this
 * worktree yet. This shim lets `PathObjectSafe` import it without breaking
 * `tsc --noEmit`. Once the real module ships at
 * `src/components/path-objects/index.ts(x)`, its real exports take
 * precedence over this fallback declaration.
 *
 * Safe to delete once the real module lands — `PathObjectSafe` tolerates
 * either shape (real component or missing module via runtime catch).
 *
 * NOTE: kept as a global script (no top-level import/export) so the
 * `declare module` is ambient, not augmentation.
 */
declare module "@/components/path-objects" {
  type PathObjectProps = { slug: string; size?: number };
  export const PathObject: (props: PathObjectProps) => unknown;
}
