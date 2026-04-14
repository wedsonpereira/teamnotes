-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Page 1',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "compressedContent" BYTEA,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Page_roomId_sortOrder_idx" ON "Page"("roomId", "sortOrder");

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
