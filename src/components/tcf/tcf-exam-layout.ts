import type { CSSProperties } from "react";

export const TCF_COMPREHENSION_MAX_WIDTH = 1320;

export const tcfComprehensionShellStyle: CSSProperties = {
  width: "100%",
  maxWidth: TCF_COMPREHENSION_MAX_WIDTH,
  margin: "0 auto",
  padding: "24px clamp(16px, 2.5vw, 40px) 80px",
  boxSizing: "border-box",
};
