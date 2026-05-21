import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("DATABASE_URL:", process.env.DATABASE_URL);
  try {
    const paths = await prisma.learningPath.findMany({
      include: {
        lessons: {
          select: {
            slug: true,
            title: true,
          },
        },
      },
    });
    console.log("Found learning paths:", paths.length);
    for (const p of paths) {
      console.log(`- Path: ${p.title} (${p.slug})`);
      for (const l of p.lessons) {
        console.log(`  * Lesson: ${l.title} (${l.slug})`);
      }
    }

    const challenges = await prisma.dailyChallenge.findMany();
    console.log("Found daily challenges:", challenges.length);
  } catch (error) {
    console.error("Error querying database:", error);
  }
}

main();
