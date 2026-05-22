import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// All routes are accessible as guest — auth is optional throughout the app
export default function proxy(_req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};
