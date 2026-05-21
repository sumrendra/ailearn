import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("Error: DATABASE_URL environment variable is not set!");
  process.exit(1);
}

console.log("Checking DB connection with URL:", connectionString.replace(/:[^:@]+@/, ":****@")); // Mask password

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
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
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
