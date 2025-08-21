/*
  Warnings:

  - You are about to drop the column `conditionsPaiement` on the `ConditionsCommerciales` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."ConditionsCommerciales" DROP COLUMN "conditionsPaiement",
ADD COLUMN     "conditionsPaiementId" TEXT;

-- AlterTable
ALTER TABLE "public"."FournisseurDetails" ADD COLUMN     "compteComptableId" TEXT,
ADD COLUMN     "conditionsPaiementId" TEXT;

-- CreateTable
CREATE TABLE "public"."PlanComptable" (
    "id" TEXT NOT NULL,
    "numeroCompte" TEXT NOT NULL,
    "intitule" TEXT NOT NULL,
    "categorie" TEXT NOT NULL,
    "description" TEXT,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanComptable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ConditionsPaiement" (
    "id" TEXT NOT NULL,
    "libelle" TEXT NOT NULL,
    "delai" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConditionsPaiement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlanComptable_numeroCompte_key" ON "public"."PlanComptable"("numeroCompte");

-- CreateIndex
CREATE INDEX "PlanComptable_numeroCompte_idx" ON "public"."PlanComptable"("numeroCompte");

-- CreateIndex
CREATE INDEX "PlanComptable_categorie_idx" ON "public"."PlanComptable"("categorie");

-- CreateIndex
CREATE UNIQUE INDEX "ConditionsPaiement_libelle_key" ON "public"."ConditionsPaiement"("libelle");

-- CreateIndex
CREATE INDEX "ConditionsPaiement_libelle_idx" ON "public"."ConditionsPaiement"("libelle");

-- CreateIndex
CREATE INDEX "ConditionsPaiement_actif_idx" ON "public"."ConditionsPaiement"("actif");

-- AddForeignKey
ALTER TABLE "public"."FournisseurDetails" ADD CONSTRAINT "FournisseurDetails_compteComptableId_fkey" FOREIGN KEY ("compteComptableId") REFERENCES "public"."PlanComptable"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FournisseurDetails" ADD CONSTRAINT "FournisseurDetails_conditionsPaiementId_fkey" FOREIGN KEY ("conditionsPaiementId") REFERENCES "public"."ConditionsPaiement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ConditionsCommerciales" ADD CONSTRAINT "ConditionsCommerciales_conditionsPaiementId_fkey" FOREIGN KEY ("conditionsPaiementId") REFERENCES "public"."ConditionsPaiement"("id") ON DELETE SET NULL ON UPDATE CASCADE;
