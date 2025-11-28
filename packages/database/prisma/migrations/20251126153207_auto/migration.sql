-- CreateEnum
CREATE TYPE "ServerStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "TeamMemberRole" AS ENUM ('OWNER', 'ADMIN', 'MODERATOR', 'MEMBER');

-- CreateTable
CREATE TABLE "teams" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,
    "logo" TEXT,
    "banner" TEXT,
    "website" TEXT,
    "discordUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_members" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "TeamMemberRole" NOT NULL DEFAULT 'MEMBER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "team_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "servers" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "shortDesc" VARCHAR(200),
    "serverIp" TEXT NOT NULL,
    "port" INTEGER NOT NULL DEFAULT 25565,
    "status" "ServerStatus" NOT NULL DEFAULT 'PENDING',
    "logo" TEXT,
    "banner" TEXT,
    "gameVersion" TEXT NOT NULL,
    "supportedVersions" TEXT[],
    "currentPlayers" INTEGER NOT NULL DEFAULT 0,
    "maxPlayers" INTEGER NOT NULL DEFAULT 100,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "lastPing" TIMESTAMP(3),
    "votesCount" INTEGER NOT NULL DEFAULT 0,
    "websiteUrl" TEXT,
    "discordUrl" TEXT,
    "youtubeUrl" TEXT,
    "twitterUrl" TEXT,
    "tiktokUrl" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "rejectionReason" TEXT,
    "approvedAt" TIMESTAMP(3),
    "approvedBy" TEXT,
    "ownerId" TEXT NOT NULL,
    "teamId" TEXT,

    CONSTRAINT "servers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "server_tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT DEFAULT '#69a024',
    "icon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "server_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "server_tag_relations" (
    "id" TEXT NOT NULL,
    "serverId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "server_tag_relations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "server_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "color" TEXT DEFAULT '#69a024',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "server_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "server_category_relations" (
    "id" TEXT NOT NULL,
    "serverId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "server_category_relations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "server_status_history" (
    "id" TEXT NOT NULL,
    "serverId" TEXT NOT NULL,
    "oldStatus" "ServerStatus",
    "newStatus" "ServerStatus" NOT NULL,
    "reason" TEXT,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changedBy" TEXT,

    CONSTRAINT "server_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "server_player_history" (
    "id" TEXT NOT NULL,
    "serverId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "currentPlayers" INTEGER NOT NULL,
    "isOnline" BOOLEAN NOT NULL,
    "pingMs" INTEGER,

    CONSTRAINT "server_player_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "teams_name_key" ON "teams"("name");

-- CreateIndex
CREATE INDEX "teams_ownerId_idx" ON "teams"("ownerId");

-- CreateIndex
CREATE INDEX "team_members_teamId_idx" ON "team_members"("teamId");

-- CreateIndex
CREATE INDEX "team_members_userId_idx" ON "team_members"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "team_members_teamId_userId_key" ON "team_members"("teamId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "servers_slug_key" ON "servers"("slug");

-- CreateIndex
CREATE INDEX "servers_slug_idx" ON "servers"("slug");

-- CreateIndex
CREATE INDEX "servers_status_idx" ON "servers"("status");

-- CreateIndex
CREATE INDEX "servers_ownerId_idx" ON "servers"("ownerId");

-- CreateIndex
CREATE INDEX "servers_teamId_idx" ON "servers"("teamId");

-- CreateIndex
CREATE INDEX "servers_featured_idx" ON "servers"("featured");

-- CreateIndex
CREATE INDEX "servers_votesCount_idx" ON "servers"("votesCount");

-- CreateIndex
CREATE INDEX "servers_createdAt_idx" ON "servers"("createdAt");

-- CreateIndex
CREATE INDEX "servers_isOnline_idx" ON "servers"("isOnline");

-- CreateIndex
CREATE UNIQUE INDEX "server_tags_name_key" ON "server_tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "server_tags_slug_key" ON "server_tags"("slug");

-- CreateIndex
CREATE INDEX "server_tag_relations_serverId_idx" ON "server_tag_relations"("serverId");

-- CreateIndex
CREATE INDEX "server_tag_relations_tagId_idx" ON "server_tag_relations"("tagId");

-- CreateIndex
CREATE UNIQUE INDEX "server_tag_relations_serverId_tagId_key" ON "server_tag_relations"("serverId", "tagId");

-- CreateIndex
CREATE UNIQUE INDEX "server_categories_name_key" ON "server_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "server_categories_slug_key" ON "server_categories"("slug");

-- CreateIndex
CREATE INDEX "server_category_relations_serverId_idx" ON "server_category_relations"("serverId");

-- CreateIndex
CREATE INDEX "server_category_relations_categoryId_idx" ON "server_category_relations"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "server_category_relations_serverId_categoryId_key" ON "server_category_relations"("serverId", "categoryId");

-- CreateIndex
CREATE INDEX "server_status_history_serverId_idx" ON "server_status_history"("serverId");

-- CreateIndex
CREATE INDEX "server_status_history_changedAt_idx" ON "server_status_history"("changedAt");

-- CreateIndex
CREATE INDEX "server_player_history_serverId_timestamp_idx" ON "server_player_history"("serverId", "timestamp");

-- CreateIndex
CREATE INDEX "server_player_history_timestamp_idx" ON "server_player_history"("timestamp");

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servers" ADD CONSTRAINT "servers_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servers" ADD CONSTRAINT "servers_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servers" ADD CONSTRAINT "servers_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "server_tag_relations" ADD CONSTRAINT "server_tag_relations_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "servers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "server_tag_relations" ADD CONSTRAINT "server_tag_relations_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "server_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "server_category_relations" ADD CONSTRAINT "server_category_relations_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "servers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "server_category_relations" ADD CONSTRAINT "server_category_relations_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "server_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "server_status_history" ADD CONSTRAINT "server_status_history_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "servers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "server_status_history" ADD CONSTRAINT "server_status_history_changedBy_fkey" FOREIGN KEY ("changedBy") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "server_player_history" ADD CONSTRAINT "server_player_history_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "servers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
