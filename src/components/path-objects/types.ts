export interface PathObjectProps {
  /** CSS color to render the primary stroke. Inherits `currentColor` if unset. */
  color?: string;
  /** Width in px; height tracks aspect ratio (square). */
  size?: number;
  /** Adds a hover animation if true. Pages that render multiple path objects
   *  in a row should pass `animated={false}` to avoid visual noise. */
  animated?: boolean;
  className?: string;
}
