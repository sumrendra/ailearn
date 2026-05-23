import { getPathMeta } from "@/lib/learning-paths";

interface PathIconProps {
  slug: string;
  size?: number;
  /** "tint" — soft pastel tile (default for cards & lists)
   *  "gradient" — full brand gradient tile (heroes)
   *  "plain" — no tile, just icon */
  variant?: "tint" | "gradient" | "plain";
}

/**
 * Reusable icon-in-tile used everywhere a learning path is referenced.
 * Resolves color/icon from the central metadata module so all surfaces
 * stay consistent if you change one path's branding.
 */
export function PathIcon({ slug, size = 44, variant = "tint" }: PathIconProps) {
  const { Icon, color, tint, ring, gradient } = getPathMeta(slug);
  const iconSize = Math.max(14, Math.round(size * 0.5));

  if (variant === "plain") {
    return <Icon size={iconSize} color={color} />;
  }

  const isGradient = variant === "gradient";
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: Math.max(10, Math.round(size * 0.28)),
        background: isGradient ? gradient : tint,
        border: isGradient ? "1px solid rgba(255,255,255,0.25)" : `1px solid ${ring}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Icon size={iconSize} color={isGradient ? "#fff" : color} />
    </div>
  );
}
