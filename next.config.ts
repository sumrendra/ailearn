import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // These packages are pure ESM and must be transpiled by Next.js
  transpilePackages: [
    "react-markdown",
    "rehype-highlight",
    "remark-gfm",
    "remark-rehype",
    "unified",
    "bail",
    "is-plain-obj",
    "trough",
    "vfile",
    "vfile-message",
    "unist-util-stringify-position",
    "mdast-util-from-markdown",
    "mdast-util-to-string",
    "mdast-util-to-hast",
    "mdast-util-gfm",
    "hast-util-to-jsx-runtime",
    "hast-util-whitespace",
    "hast-util-is-element",
    "property-information",
    "space-separated-tokens",
    "comma-separated-tokens",
    "html-void-elements",
    "zwitch",
    "lowlight",
    "highlight.js",
    "devlop",
    "@types/hast",
    "@types/unist",
    "@types/mdast",
  ],
};

export default nextConfig;
