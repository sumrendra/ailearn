import type { CSSProperties } from "react";

export const TCF_COMPREHENSION_MAX_WIDTH = 1440;

export const tcfComprehensionShellStyle: CSSProperties = {
  width: "100%",
  maxWidth: TCF_COMPREHENSION_MAX_WIDTH,
  margin: "0 auto",
  padding: "20px clamp(20px, 3vw, 48px) 80px",
  boxSizing: "border-box",
};
