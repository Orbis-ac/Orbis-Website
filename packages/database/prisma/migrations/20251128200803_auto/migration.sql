-- CreateEnum
CREATE TYPE "ReportReason" AS ENUM ('SPAM', 'REUPLOADED_WORK', 'INAPPROPRIATE', 'MALICIOUS', 'NAME_SQUATTING', 'POOR_DESCRIPTION', 'INVALID_METADATA', 'OTHER');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED');

-- CreateEnum
CREATE TYPE "ReportResourceType" AS ENUM ('USER');

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resourceType" "ReportResourceType" NOT NULL,
    "resourceId" TEXT NOT NULL,
    "reason" "ReportReason" NOT NULL,
    "description" TEXT,
    "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "reporterId" TEXT NOT NULL,
    "handledBy" TEXT,
    "handledAt" TIMESTAMP(3),
    "response" TEXT,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "reports_resourceType_resourceId_idx" ON "reports"("resourceType", "resourceId");

-- CreateIndex
CREATE INDEX "reports_reporterId_idx" ON "reports"("reporterId");

-- CreateIndex
CREATE INDEX "reports_status_idx" ON "reports"("status");

-- CreateIndex
CREATE INDEX "reports_createdAt_idx" ON "reports"("createdAt");

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_handledBy_fkey" FOREIGN KEY ("handledBy") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
