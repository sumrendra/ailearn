-- Store per-phase study mode (self / tutor / mixed) on TCF roadmap
ALTER TABLE "TcfProfile" ADD COLUMN IF NOT EXISTS "roadmapPrefs" JSONB;
