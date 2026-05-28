import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getAllPaths } from "@/lib/content";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { CanvasBackdrop } from "@/components/layout/CanvasBackdrop";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  let userRecord = null;

  if (session?.user?.id) {
    userRecord = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true, image: true, xp: true, level: true, currentStreak: true },
    });
  }

  // Index of every course + lesson — fed to the global Cmd-K palette.
  const pathsRaw = getAllPaths();

  const palettePaths = pathsRaw.map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    lessonCount: p.lessons.length,
  }));

  const paletteLessons = pathsRaw.flatMap((p) =>
    p.lessons.map((l) => ({
      slug: l.slug,
      title: l.title,
      pathSlug: p.slug,
      pathTitle: p.title,
    })),
  );

  const sidebarUser = userRecord ?? (session?.user ? {
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
  } : null);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-app)", position: "relative" }}>
      {/* Always-on atmospheric layer (mesh + grain). Mounted once here so
          every authenticated page inherits the canvas. Pure CSS, no JS work
          per route. */}
      <CanvasBackdrop />

      <AppSidebar user={sidebarUser} />
      <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        {children}
      </main>
      <CommandPalette paths={palettePaths} lessons={paletteLessons} />
    </div>
  );
}
