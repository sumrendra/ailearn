-- TCF Canada Program: user profile, unit progress, grammar mastery, exam attempts

CREATE TABLE "TcfProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "targetNclc" INTEGER NOT NULL DEFAULT 7,
    "placementCefr" TEXT NOT NULL DEFAULT 'A0',
    "weeklyHours" INTEGER NOT NULL DEFAULT 6,
    "examDate" TIMESTAMP(3),
    "onboardingDone" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TcfProfile_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "TcfProfile_userId_key" ON "TcfProfile"("userId");

CREATE TABLE "TcfUnitProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "unitSlug" TEXT NOT NULL,
    "status" "ProgressStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "completedAt" TIMESTAMP(3),
    "timeSpentMins" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TcfUnitProgress_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "TcfUnitProgress_userId_unitSlug_key" ON "TcfUnitProgress"("userId", "unitSlug");
CREATE INDEX "TcfUnitProgress_unitSlug_idx" ON "TcfUnitProgress"("unitSlug");

CREATE TABLE "TcfGrammarMastery" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'available',
    "lastScore" INTEGER,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TcfGrammarMastery_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "TcfGrammarMastery_userId_topicId_key" ON "TcfGrammarMastery"("userId", "topicId");

CREATE TABLE "TcfAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "paper" INTEGER,
    "scoreRaw" DOUBLE PRECISION,
    "scoreNclc" INTEGER,
    "score699" INTEGER,
    "durationSec" INTEGER NOT NULL DEFAULT 0,
    "detailJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TcfAttempt_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "TcfAttempt_userId_module_idx" ON "TcfAttempt"("userId", "module");
CREATE INDEX "TcfAttempt_userId_createdAt_idx" ON "TcfAttempt"("userId", "createdAt");

ALTER TABLE "TcfProfile" ADD CONSTRAINT "TcfProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TcfUnitProgress" ADD CONSTRAINT "TcfUnitProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TcfGrammarMastery" ADD CONSTRAINT "TcfGrammarMastery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TcfAttempt" ADD CONSTRAINT "TcfAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
