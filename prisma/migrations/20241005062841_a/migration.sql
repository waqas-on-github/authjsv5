-- CreateTable
CREATE TABLE "VerficationToken" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerficationToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VerficationToken_token_key" ON "VerficationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerficationToken_email_token_key" ON "VerficationToken"("email", "token");
