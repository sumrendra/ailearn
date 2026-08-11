/**
 * Course Atlas graph model.
 *
 * Builds the serializable node/link payload for the /map knowledge graph from
 * the static curriculum (paths + lessons + TCF module) and per-user progress.
 * Pure module: no React, safe in server components. Layout, physics, and
 * rendering live client-side in `src/components/map/`.
 */
import { getAllPaths } from "@/lib/content";
import { getPathMeta } from "@/lib/learning-paths";

export type AtlasNodeKind = "path" | "lesson" | "hub" | "module";

export type LessonStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

export interface AtlasNode {
  id: string;
  kind: AtlasNodeKind;
  label: string;
  /** Secondary line shown in the detail panel (path title, module hint…) */
  sub: string;
  description: string;
  /** Destination page — every node is a real route */
  url: string;
  /** Path identity color (hex) — ambient only, per DESIGN.md */
  color: string;
  /** Owning path slug for lesson nodes; the hub id for module nodes */
  parent?: string;
  /** Visual + physics radius in world units */
  r: number;
  status: LessonStatus;
  mins?: number;
  xp?: number;
  order?: number;
  /** Path aggregates */
  lessonCount?: number;
  completedCount?: number;
  difficulty?: string;
}

export type AtlasLinkKind = "spoke" | "chain" | "bridge";

export interface AtlasLink {
  source: string;
  target: string;
  kind: AtlasLinkKind;
}

export interface AtlasGraph {
  nodes: AtlasNode[];
  links: AtlasLink[];
  totals: { paths: number; lessons: number; completed: number };
}

/**
 * Curated cross-path relations — the "web" between clusters. Directed
 * loosely as prerequisite → next step; rendering treats them as undirected.
 * Pairs referencing a missing path are silently dropped, so this list can't
 * break the graph when the curriculum changes.
 */
const PATH_BRIDGES: Array<[string, string]> = [
  ["llm-foundations", "rag-vector-dbs"],
  ["llm-foundations", "ai-agents"],
  ["rag-vector-dbs", "ai-agents"],
  ["sql-mastery", "rag-vector-dbs"],
  ["excel-mastery", "sql-mastery"],
  ["java-complete", "java-frameworks"],
  ["java-complete", "java-advanced"],
  ["java-frameworks", "microservices-architecture"],
  ["kafka-essentials", "microservices-architecture"],
  ["microservices-architecture", "system-design"],
  ["java-advanced", "system-design"],
  ["french-fundamentals", "french-advanced"],
];

const TCF_HUB_ID = "tcf";
const TCF_COLOR = "#c2367f";

const TCF_MODULES: Array<{ id: string; label: string; url: string; description: string }> = [
  {
    id: "tcf-listening",
    label: "Listening",
    url: "/tcf/listening",
    description: "Compréhension orale — 39 questions with native-speed audio, practice or exam draw.",
  },
  {
    id: "tcf-reading",
    label: "Reading",
    url: "/tcf/reading",
    description: "Compréhension écrite — passages and MCQ across CEFR levels A1 to C2.",
  },
  {
    id: "tcf-writing",
    label: "Writing",
    url: "/tcf/writing",
    description: "Expression écrite — three tasks scored by AI against the official FEI rubric.",
  },
  {
    id: "tcf-speaking",
    label: "Speaking",
    url: "/tcf/speaking",
    description: "Expression orale — record responses, get multimodal AI evaluation.",
  },
];

function lessonRadius(mins: number | undefined): number {
  // 15 min → ~5.9, 30 min → ~6.9, 60 min → ~8.2. Subtle, not shouty.
  const m = Math.max(10, Math.min(90, mins ?? 20));
  return 4.6 + Math.sqrt(m) * 0.46;
}

function pathRadius(lessonCount: number): number {
  // 6 lessons → 15.7, 10 lessons → 17.5
  return 13 + lessonCount * 0.45;
}

export function buildAtlasGraph(progress: Record<string, LessonStatus>): AtlasGraph {
  const paths = getAllPaths();
  const nodes: AtlasNode[] = [];
  const links: AtlasLink[] = [];

  let totalLessons = 0;
  let totalCompleted = 0;

  for (const path of paths) {
    const meta = getPathMeta(path.slug);
    const completedCount = path.lessons.filter((l) => progress[l.slug] === "COMPLETED").length;
    totalLessons += path.lessons.length;
    totalCompleted += completedCount;

    nodes.push({
      id: path.slug,
      kind: "path",
      label: path.title,
      sub: `${path.lessons.length} lessons · ${path.difficulty.toLowerCase()}`,
      description: path.description,
      url: `/learn/${path.slug}`,
      color: meta.color,
      r: pathRadius(path.lessons.length),
      status:
        completedCount === path.lessons.length && path.lessons.length > 0
          ? "COMPLETED"
          : completedCount > 0
            ? "IN_PROGRESS"
            : "NOT_STARTED",
      lessonCount: path.lessons.length,
      completedCount,
      difficulty: path.difficulty,
    });

    let prevLessonId: string | null = null;
    for (const lesson of path.lessons) {
      const id = `lesson:${lesson.slug}`;
      nodes.push({
        id,
        kind: "lesson",
        label: lesson.title,
        sub: path.title,
        description: lesson.description,
        url: `/lessons/${lesson.slug}`,
        color: meta.color,
        parent: path.slug,
        r: lessonRadius(lesson.estimatedMins),
        status: progress[lesson.slug] ?? "NOT_STARTED",
        mins: lesson.estimatedMins,
        xp: lesson.xpReward,
        order: lesson.order,
      });
      links.push({ source: path.slug, target: id, kind: "spoke" });
      if (prevLessonId) links.push({ source: prevLessonId, target: id, kind: "chain" });
      prevLessonId = id;
    }
  }

  const pathIds = new Set(paths.map((p) => p.slug));
  for (const [a, b] of PATH_BRIDGES) {
    if (pathIds.has(a) && pathIds.has(b)) links.push({ source: a, target: b, kind: "bridge" });
  }

  // TCF Canada cluster — exam simulator, separate from the french-advanced path
  nodes.push({
    id: TCF_HUB_ID,
    kind: "hub",
    label: "TCF Canada",
    sub: "Exam simulator · 4 modules",
    description:
      "Full TCF Canada mock exam — listening, reading, writing, and speaking with difficulty-weighted scoring and NCLC readiness verdicts.",
    url: "/tcf",
    color: TCF_COLOR,
    r: 14,
    status: "NOT_STARTED",
  });
  for (const mod of TCF_MODULES) {
    nodes.push({
      id: mod.id,
      kind: "module",
      label: mod.label,
      sub: "TCF Canada",
      description: mod.description,
      url: mod.url,
      color: TCF_COLOR,
      parent: TCF_HUB_ID,
      r: 7.5,
      status: "NOT_STARTED",
    });
    links.push({ source: TCF_HUB_ID, target: mod.id, kind: "spoke" });
  }
  if (pathIds.has("french-advanced")) {
    links.push({ source: "french-advanced", target: TCF_HUB_ID, kind: "bridge" });
  }

  return {
    nodes,
    links,
    totals: { paths: paths.length, lessons: totalLessons, completed: totalCompleted },
  };
}
