CREATE TYPE "MemberAccess" AS ENUM ('VIEW', 'EDIT');

ALTER TABLE "RoomMember"
ADD COLUMN "access" "MemberAccess" NOT NULL DEFAULT 'EDIT';
