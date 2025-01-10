-- CreateTable
CREATE TABLE "Blocks" (
    "id" TEXT NOT NULL,
    "block_number" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "total" BIGINT NOT NULL,
    "fees" BIGINT NOT NULL,
    "size" BIGINT NOT NULL,
    "n_tx" BIGINT NOT NULL,

    CONSTRAINT "Blocks_pkey" PRIMARY KEY ("id")
);
