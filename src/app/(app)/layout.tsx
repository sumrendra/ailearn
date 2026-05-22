import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { IconRail } from "@/components/layout/IconRail";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  let userRecord = null;

  if (session?.user?.id) {
    userRecord = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true, image: true, xp: true, level: true, currentStreak: true },
    });
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-app)" }}>
      <IconRail user={userRecord ?? (session?.user ? { name: session.user.name, email: session.user.email, image: session.user.image } : null)} />
      <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        {children}
      </main>
    </div>
  );
}
