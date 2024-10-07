-- CreateTable
CREATE TABLE "PasswordResetLink" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PasswordResetLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetLink_token_key" ON "PasswordResetLink"("token");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetLink_email_token_key" ON "PasswordResetLink"("email", "token");
