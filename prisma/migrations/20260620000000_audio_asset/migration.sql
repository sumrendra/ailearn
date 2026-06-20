-- Audio metadata (files live on persistent volume, not in DB)
CREATE TABLE IF NOT EXISTS "AudioAsset" (
    "id" TEXT NOT NULL,
    "namespace" TEXT NOT NULL,
    "paper" INTEGER NOT NULL,
    "questionIndex" INTEGER NOT NULL,
    "contentHash" TEXT NOT NULL,
    "storagePath" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL DEFAULT 'audio/mpeg',
    "voice" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AudioAsset_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "AudioAsset_namespace_paper_questionIndex_key"
  ON "AudioAsset"("namespace", "paper", "questionIndex");

CREATE INDEX IF NOT EXISTS "AudioAsset_namespace_paper_idx"
  ON "AudioAsset"("namespace", "paper");
