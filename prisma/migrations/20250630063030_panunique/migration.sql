/*
  Warnings:

  - A unique constraint covering the columns `[panNumber]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "users_panNumber_key" ON "users"("panNumber");
