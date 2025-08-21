-- AlterTable
ALTER TABLE "public"."Tiers" ADD COLUMN     "description" TEXT;

-- CreateTable
CREATE TABLE "public"."FournisseurDetails" (
    "id" TEXT NOT NULL,
    "tiersId" TEXT NOT NULL,
    "codeFournisseur" TEXT NOT NULL,
    "compteComptable" TEXT NOT NULL,
    "raisonSociale" TEXT NOT NULL,
    "formeJuridique" TEXT,
    "capitalSocial" DECIMAL(18,2),
    "tvaIntracommunautaire" TEXT,
    "codeApeNaf" TEXT,
    "rcs" TEXT,
    "greffe" TEXT,
    "adresseSiege" TEXT,
    "adresseLivraison" TEXT,
    "statut" TEXT NOT NULL DEFAULT 'ACTIF',
    "estSousTraitant" BOOLEAN NOT NULL DEFAULT false,
    "dateEntreeRelation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "plafondCredit" DECIMAL(18,2),
    "devise" TEXT NOT NULL DEFAULT 'EUR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FournisseurDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ContactFournisseur" (
    "id" TEXT NOT NULL,
    "tiersId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT,
    "telephone" TEXT,
    "email" TEXT,
    "fonction" TEXT,
    "estContactPrincipal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactFournisseur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DocumentFournisseur" (
    "id" TEXT NOT NULL,
    "tiersId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "pieceUrl" TEXT,
    "dateEmission" TIMESTAMP(3),
    "dateExpiration" TIMESTAMP(3),
    "statut" TEXT NOT NULL DEFAULT 'EN_COURS',
    "version" TEXT,
    "commentaires" TEXT,
    "ajoutePar" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentFournisseur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ConditionsCommerciales" (
    "id" TEXT NOT NULL,
    "tiersId" TEXT NOT NULL,
    "conditionsPaiement" TEXT NOT NULL,
    "escompte" DECIMAL(5,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConditionsCommerciales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RibFournisseur" (
    "id" TEXT NOT NULL,
    "fournisseurDetailsId" TEXT NOT NULL,
    "iban" TEXT NOT NULL,
    "bic" TEXT NOT NULL,
    "titulaire" TEXT NOT NULL,
    "estParDefaut" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RibFournisseur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."HistoriqueQualite" (
    "id" TEXT NOT NULL,
    "tiersId" TEXT NOT NULL,
    "dateEvaluation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notePrix" INTEGER NOT NULL,
    "noteQualite" INTEGER NOT NULL,
    "noteDelais" INTEGER NOT NULL,
    "noteReactivite" INTEGER NOT NULL,
    "scoreGlobal" DECIMAL(3,2) NOT NULL,
    "commentaires" TEXT,
    "evaluePar" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HistoriqueQualite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LitigeFournisseur" (
    "id" TEXT NOT NULL,
    "tiersId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'OUVERT',
    "dateLitige" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateResolution" TIMESTAMP(3),
    "responsable" TEXT NOT NULL,
    "commentaires" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LitigeFournisseur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."JournalActionFournisseur" (
    "id" TEXT NOT NULL,
    "tiersId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" JSONB,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JournalActionFournisseur_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FournisseurDetails_tiersId_key" ON "public"."FournisseurDetails"("tiersId");

-- CreateIndex
CREATE UNIQUE INDEX "FournisseurDetails_codeFournisseur_key" ON "public"."FournisseurDetails"("codeFournisseur");

-- CreateIndex
CREATE UNIQUE INDEX "FournisseurDetails_compteComptable_key" ON "public"."FournisseurDetails"("compteComptable");

-- CreateIndex
CREATE INDEX "FournisseurDetails_codeFournisseur_idx" ON "public"."FournisseurDetails"("codeFournisseur");

-- CreateIndex
CREATE INDEX "FournisseurDetails_compteComptable_idx" ON "public"."FournisseurDetails"("compteComptable");

-- CreateIndex
CREATE INDEX "FournisseurDetails_statut_idx" ON "public"."FournisseurDetails"("statut");

-- CreateIndex
CREATE INDEX "ContactFournisseur_tiersId_idx" ON "public"."ContactFournisseur"("tiersId");

-- CreateIndex
CREATE INDEX "ContactFournisseur_type_idx" ON "public"."ContactFournisseur"("type");

-- CreateIndex
CREATE INDEX "DocumentFournisseur_tiersId_idx" ON "public"."DocumentFournisseur"("tiersId");

-- CreateIndex
CREATE INDEX "DocumentFournisseur_type_idx" ON "public"."DocumentFournisseur"("type");

-- CreateIndex
CREATE INDEX "DocumentFournisseur_dateExpiration_idx" ON "public"."DocumentFournisseur"("dateExpiration");

-- CreateIndex
CREATE INDEX "DocumentFournisseur_statut_idx" ON "public"."DocumentFournisseur"("statut");

-- CreateIndex
CREATE UNIQUE INDEX "ConditionsCommerciales_tiersId_key" ON "public"."ConditionsCommerciales"("tiersId");

-- CreateIndex
CREATE INDEX "RibFournisseur_fournisseurDetailsId_idx" ON "public"."RibFournisseur"("fournisseurDetailsId");

-- CreateIndex
CREATE INDEX "RibFournisseur_iban_idx" ON "public"."RibFournisseur"("iban");

-- CreateIndex
CREATE INDEX "HistoriqueQualite_tiersId_idx" ON "public"."HistoriqueQualite"("tiersId");

-- CreateIndex
CREATE INDEX "HistoriqueQualite_dateEvaluation_idx" ON "public"."HistoriqueQualite"("dateEvaluation");

-- CreateIndex
CREATE INDEX "LitigeFournisseur_tiersId_idx" ON "public"."LitigeFournisseur"("tiersId");

-- CreateIndex
CREATE INDEX "LitigeFournisseur_statut_idx" ON "public"."LitigeFournisseur"("statut");

-- CreateIndex
CREATE INDEX "LitigeFournisseur_dateLitige_idx" ON "public"."LitigeFournisseur"("dateLitige");

-- CreateIndex
CREATE INDEX "JournalActionFournisseur_tiersId_idx" ON "public"."JournalActionFournisseur"("tiersId");

-- CreateIndex
CREATE INDEX "JournalActionFournisseur_action_idx" ON "public"."JournalActionFournisseur"("action");

-- CreateIndex
CREATE INDEX "JournalActionFournisseur_createdAt_idx" ON "public"."JournalActionFournisseur"("createdAt");

-- CreateIndex
CREATE INDEX "Tiers_type_idx" ON "public"."Tiers"("type");

-- CreateIndex
CREATE INDEX "Tiers_siret_idx" ON "public"."Tiers"("siret");

-- AddForeignKey
ALTER TABLE "public"."FournisseurDetails" ADD CONSTRAINT "FournisseurDetails_tiersId_fkey" FOREIGN KEY ("tiersId") REFERENCES "public"."Tiers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ContactFournisseur" ADD CONSTRAINT "ContactFournisseur_tiersId_fkey" FOREIGN KEY ("tiersId") REFERENCES "public"."Tiers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DocumentFournisseur" ADD CONSTRAINT "DocumentFournisseur_tiersId_fkey" FOREIGN KEY ("tiersId") REFERENCES "public"."Tiers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ConditionsCommerciales" ADD CONSTRAINT "ConditionsCommerciales_tiersId_fkey" FOREIGN KEY ("tiersId") REFERENCES "public"."Tiers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RibFournisseur" ADD CONSTRAINT "RibFournisseur_fournisseurDetailsId_fkey" FOREIGN KEY ("fournisseurDetailsId") REFERENCES "public"."FournisseurDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HistoriqueQualite" ADD CONSTRAINT "HistoriqueQualite_tiersId_fkey" FOREIGN KEY ("tiersId") REFERENCES "public"."Tiers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LitigeFournisseur" ADD CONSTRAINT "LitigeFournisseur_tiersId_fkey" FOREIGN KEY ("tiersId") REFERENCES "public"."Tiers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."JournalActionFournisseur" ADD CONSTRAINT "JournalActionFournisseur_tiersId_fkey" FOREIGN KEY ("tiersId") REFERENCES "public"."Tiers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
