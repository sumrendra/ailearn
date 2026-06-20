-- CreateTable
CREATE TABLE IF NOT EXISTS "TcfListeningAudio" (
    "id" TEXT NOT NULL,
    "paper" INTEGER NOT NULL,
    "questionIndex" INTEGER NOT NULL,
    "contentHash" TEXT NOT NULL,
    "audioData" BYTEA NOT NULL,
    "mimeType" TEXT NOT NULL DEFAULT 'audio/wav',
    "voice" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TcfListeningAudio_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "TcfListeningAudio_paper_questionIndex_key"
  ON "TcfListeningAudio"("paper", "questionIndex");

CREATE INDEX IF NOT EXISTS "TcfListeningAudio_paper_idx"
  ON "TcfListeningAudio"("paper");
