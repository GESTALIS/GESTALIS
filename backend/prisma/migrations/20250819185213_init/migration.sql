-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RefreshToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "deviceFingerprint" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Chantier" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "statut" TEXT NOT NULL DEFAULT 'en_preparation',
    "budgetInitial" DECIMAL(18,2) NOT NULL,
    "budgetActuel" DECIMAL(18,2) NOT NULL,
    "dateDebut" TIMESTAMP(3),
    "dateFinPrevue" TIMESTAMP(3),
    "dateFinReelle" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chantier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Tiers" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "siret" TEXT,
    "adresse" TEXT,
    "codePostal" TEXT,
    "ville" TEXT,
    "telephone" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MarcheClient" (
    "id" TEXT NOT NULL,
    "chantierId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "devise" TEXT NOT NULL DEFAULT 'EUR',
    "tvaMode" TEXT NOT NULL DEFAULT 'STANDARD',
    "retenueGarantiePct" DECIMAL(5,2) NOT NULL DEFAULT 5.00,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarcheClient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BpuPoste" (
    "id" TEXT NOT NULL,
    "marcheId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "libelle" TEXT NOT NULL,
    "unite" TEXT NOT NULL,
    "prixUnitaire" DECIMAL(18,4) NOT NULL,
    "qtePrevue" DECIMAL(18,4) NOT NULL,

    CONSTRAINT "BpuPoste_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Situation" (
    "id" TEXT NOT NULL,
    "marcheId" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "periodeDebut" TIMESTAMP(3) NOT NULL,
    "periodeFin" TIMESTAMP(3) NOT NULL,
    "penalites" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "retenuePct" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "statut" TEXT NOT NULL DEFAULT 'brouillon',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Situation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SituationLigne" (
    "id" TEXT NOT NULL,
    "situationId" TEXT NOT NULL,
    "posteId" TEXT NOT NULL,
    "qteMois" DECIMAL(18,4) NOT NULL,
    "qteCumulAvant" DECIMAL(18,4) NOT NULL,
    "qteCumulApres" DECIMAL(18,4) NOT NULL,
    "prixUnitaire" DECIMAL(18,4) NOT NULL,
    "montantMois" DECIMAL(18,2) NOT NULL,

    CONSTRAINT "SituationLigne_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Attachement" (
    "id" TEXT NOT NULL,
    "marcheId" TEXT NOT NULL,
    "posteId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "qte" DECIMAL(18,4) NOT NULL,
    "commentaire" TEXT,
    "pieceUrl" TEXT,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "Attachement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SousTraitanceContrat" (
    "id" TEXT NOT NULL,
    "chantierId" TEXT NOT NULL,
    "sousTraitantId" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "montantTtc" DECIMAL(18,2) NOT NULL,
    "retenueGarantiePct" DECIMAL(5,2) NOT NULL DEFAULT 5.00,
    "cautionRemplacement" BOOLEAN NOT NULL DEFAULT false,
    "statut" TEXT NOT NULL DEFAULT 'actif',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SousTraitanceContrat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SousTraitanceSituation" (
    "id" TEXT NOT NULL,
    "contratId" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "periodeDebut" TIMESTAMP(3) NOT NULL,
    "periodeFin" TIMESTAMP(3) NOT NULL,
    "montantMois" DECIMAL(18,2) NOT NULL,
    "retenueMois" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "penalites" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "statut" TEXT NOT NULL DEFAULT 'brouillon',

    CONSTRAINT "SousTraitanceSituation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CessionCreance" (
    "id" TEXT NOT NULL,
    "factureClientId" TEXT NOT NULL,
    "cessionnaire" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "dateCession" TIMESTAMP(3) NOT NULL,
    "montantCede" DECIMAL(18,2) NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'active',
    "pieceUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CessionCreance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Societe" (
    "id" TEXT NOT NULL,
    "raisonSociale" TEXT NOT NULL,
    "siret" TEXT,
    "tvaIntra" TEXT,
    "planComptable" JSONB NOT NULL,
    "journals" JSONB NOT NULL,
    "tvaMode" TEXT NOT NULL DEFAULT 'STANDARD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Societe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ExportComptable" (
    "id" TEXT NOT NULL,
    "societeId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "exercice" INTEGER NOT NULL,
    "periodeDebut" TIMESTAMP(3) NOT NULL,
    "periodeFin" TIMESTAMP(3) NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'en_cours',
    "fichierUrl" TEXT,
    "checksum" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExportComptable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FactureClient" (
    "id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "montantHT" DECIMAL(18,2) NOT NULL,
    "montantTVA" DECIMAL(18,2) NOT NULL,
    "montantTotal" DECIMAL(18,2) NOT NULL,
    "dateFacture" TIMESTAMP(3) NOT NULL,
    "dateEcheance" TIMESTAMP(3),
    "statut" TEXT NOT NULL DEFAULT 'emise',
    "resteALetrer" DECIMAL(18,2) NOT NULL,
    "chantierId" TEXT NOT NULL,
    "tiersId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FactureClient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FactureFournisseur" (
    "id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "montantHT" DECIMAL(18,2) NOT NULL,
    "montantTVA" DECIMAL(18,2) NOT NULL,
    "montantTotal" DECIMAL(18,2) NOT NULL,
    "dateFacture" TIMESTAMP(3) NOT NULL,
    "dateEcheance" TIMESTAMP(3),
    "statut" TEXT NOT NULL DEFAULT 'emise',
    "resteALetrer" DECIMAL(18,2) NOT NULL,
    "chantierId" TEXT NOT NULL,
    "tiersId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FactureFournisseur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Reglement" (
    "id" TEXT NOT NULL,
    "montant" DECIMAL(18,2) NOT NULL,
    "dateReglement" TIMESTAMP(3) NOT NULL,
    "modeReglement" TEXT NOT NULL,
    "reference" TEXT,
    "referenceBancaire" TEXT,
    "factureClientId" TEXT,
    "factureFournisseurId" TEXT,
    "sourceImportId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reglement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ImportBanque" (
    "id" TEXT NOT NULL,
    "nomFichier" TEXT NOT NULL,
    "dateImport" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statut" TEXT NOT NULL DEFAULT 'preview',
    "checksum" TEXT NOT NULL,

    CONSTRAINT "ImportBanque_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ImportBanqueLigne" (
    "id" TEXT NOT NULL,
    "importBanqueId" TEXT NOT NULL,
    "dateOperation" TIMESTAMP(3) NOT NULL,
    "montant" DECIMAL(18,2) NOT NULL,
    "libelle" TEXT NOT NULL,
    "reference" TEXT,

    CONSTRAINT "ImportBanqueLigne_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Lettrage" (
    "id" TEXT NOT NULL,
    "montant" DECIMAL(18,2) NOT NULL,
    "factureClientId" TEXT,
    "factureFournisseurId" TEXT,
    "reglementId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lettrage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "resourceId" TEXT,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "public"."RefreshToken"("userId");

-- CreateIndex
CREATE INDEX "Tiers_nom_idx" ON "public"."Tiers"("nom");

-- CreateIndex
CREATE INDEX "MarcheClient_chantierId_idx" ON "public"."MarcheClient"("chantierId");

-- CreateIndex
CREATE UNIQUE INDEX "MarcheClient_chantierId_reference_key" ON "public"."MarcheClient"("chantierId", "reference");

-- CreateIndex
CREATE INDEX "BpuPoste_marcheId_idx" ON "public"."BpuPoste"("marcheId");

-- CreateIndex
CREATE UNIQUE INDEX "BpuPoste_marcheId_code_key" ON "public"."BpuPoste"("marcheId", "code");

-- CreateIndex
CREATE INDEX "Situation_marcheId_statut_idx" ON "public"."Situation"("marcheId", "statut");

-- CreateIndex
CREATE UNIQUE INDEX "Situation_marcheId_numero_key" ON "public"."Situation"("marcheId", "numero");

-- CreateIndex
CREATE INDEX "SituationLigne_situationId_idx" ON "public"."SituationLigne"("situationId");

-- CreateIndex
CREATE INDEX "Attachement_marcheId_posteId_date_idx" ON "public"."Attachement"("marcheId", "posteId", "date");

-- CreateIndex
CREATE INDEX "SousTraitanceContrat_chantierId_statut_idx" ON "public"."SousTraitanceContrat"("chantierId", "statut");

-- CreateIndex
CREATE UNIQUE INDEX "SousTraitanceContrat_chantierId_reference_key" ON "public"."SousTraitanceContrat"("chantierId", "reference");

-- CreateIndex
CREATE INDEX "SousTraitanceSituation_contratId_statut_idx" ON "public"."SousTraitanceSituation"("contratId", "statut");

-- CreateIndex
CREATE UNIQUE INDEX "SousTraitanceSituation_contratId_numero_key" ON "public"."SousTraitanceSituation"("contratId", "numero");

-- CreateIndex
CREATE INDEX "CessionCreance_statut_idx" ON "public"."CessionCreance"("statut");

-- CreateIndex
CREATE UNIQUE INDEX "CessionCreance_factureClientId_key" ON "public"."CessionCreance"("factureClientId");

-- CreateIndex
CREATE INDEX "ExportComptable_societeId_type_statut_idx" ON "public"."ExportComptable"("societeId", "type", "statut");

-- CreateIndex
CREATE UNIQUE INDEX "FactureClient_numero_key" ON "public"."FactureClient"("numero");

-- CreateIndex
CREATE INDEX "FactureClient_chantierId_statut_idx" ON "public"."FactureClient"("chantierId", "statut");

-- CreateIndex
CREATE INDEX "FactureClient_tiersId_idx" ON "public"."FactureClient"("tiersId");

-- CreateIndex
CREATE UNIQUE INDEX "FactureFournisseur_numero_key" ON "public"."FactureFournisseur"("numero");

-- CreateIndex
CREATE INDEX "FactureFournisseur_chantierId_statut_idx" ON "public"."FactureFournisseur"("chantierId", "statut");

-- CreateIndex
CREATE INDEX "FactureFournisseur_tiersId_idx" ON "public"."FactureFournisseur"("tiersId");

-- CreateIndex
CREATE INDEX "Reglement_factureClientId_idx" ON "public"."Reglement"("factureClientId");

-- CreateIndex
CREATE INDEX "Reglement_factureFournisseurId_idx" ON "public"."Reglement"("factureFournisseurId");

-- CreateIndex
CREATE INDEX "Reglement_sourceImportId_idx" ON "public"."Reglement"("sourceImportId");

-- CreateIndex
CREATE INDEX "ImportBanque_statut_idx" ON "public"."ImportBanque"("statut");

-- CreateIndex
CREATE INDEX "ImportBanque_checksum_idx" ON "public"."ImportBanque"("checksum");

-- CreateIndex
CREATE INDEX "ImportBanqueLigne_importBanqueId_idx" ON "public"."ImportBanqueLigne"("importBanqueId");

-- CreateIndex
CREATE INDEX "ImportBanqueLigne_dateOperation_idx" ON "public"."ImportBanqueLigne"("dateOperation");

-- CreateIndex
CREATE INDEX "Lettrage_reglementId_idx" ON "public"."Lettrage"("reglementId");

-- CreateIndex
CREATE INDEX "Lettrage_factureClientId_idx" ON "public"."Lettrage"("factureClientId");

-- CreateIndex
CREATE INDEX "Lettrage_factureFournisseurId_idx" ON "public"."Lettrage"("factureFournisseurId");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "public"."AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_resource_resourceId_idx" ON "public"."AuditLog"("resource", "resourceId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "public"."AuditLog"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MarcheClient" ADD CONSTRAINT "MarcheClient_chantierId_fkey" FOREIGN KEY ("chantierId") REFERENCES "public"."Chantier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MarcheClient" ADD CONSTRAINT "MarcheClient_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."Tiers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BpuPoste" ADD CONSTRAINT "BpuPoste_marcheId_fkey" FOREIGN KEY ("marcheId") REFERENCES "public"."MarcheClient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Situation" ADD CONSTRAINT "Situation_marcheId_fkey" FOREIGN KEY ("marcheId") REFERENCES "public"."MarcheClient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SituationLigne" ADD CONSTRAINT "SituationLigne_situationId_fkey" FOREIGN KEY ("situationId") REFERENCES "public"."Situation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SituationLigne" ADD CONSTRAINT "SituationLigne_posteId_fkey" FOREIGN KEY ("posteId") REFERENCES "public"."BpuPoste"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Attachement" ADD CONSTRAINT "Attachement_marcheId_fkey" FOREIGN KEY ("marcheId") REFERENCES "public"."MarcheClient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Attachement" ADD CONSTRAINT "Attachement_posteId_fkey" FOREIGN KEY ("posteId") REFERENCES "public"."BpuPoste"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SousTraitanceContrat" ADD CONSTRAINT "SousTraitanceContrat_chantierId_fkey" FOREIGN KEY ("chantierId") REFERENCES "public"."Chantier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SousTraitanceContrat" ADD CONSTRAINT "SousTraitanceContrat_sousTraitantId_fkey" FOREIGN KEY ("sousTraitantId") REFERENCES "public"."Tiers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SousTraitanceSituation" ADD CONSTRAINT "SousTraitanceSituation_contratId_fkey" FOREIGN KEY ("contratId") REFERENCES "public"."SousTraitanceContrat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CessionCreance" ADD CONSTRAINT "CessionCreance_factureClientId_fkey" FOREIGN KEY ("factureClientId") REFERENCES "public"."FactureClient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ExportComptable" ADD CONSTRAINT "ExportComptable_societeId_fkey" FOREIGN KEY ("societeId") REFERENCES "public"."Societe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FactureClient" ADD CONSTRAINT "FactureClient_chantierId_fkey" FOREIGN KEY ("chantierId") REFERENCES "public"."Chantier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FactureClient" ADD CONSTRAINT "FactureClient_tiersId_fkey" FOREIGN KEY ("tiersId") REFERENCES "public"."Tiers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FactureFournisseur" ADD CONSTRAINT "FactureFournisseur_chantierId_fkey" FOREIGN KEY ("chantierId") REFERENCES "public"."Chantier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FactureFournisseur" ADD CONSTRAINT "FactureFournisseur_tiersId_fkey" FOREIGN KEY ("tiersId") REFERENCES "public"."Tiers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reglement" ADD CONSTRAINT "Reglement_factureClientId_fkey" FOREIGN KEY ("factureClientId") REFERENCES "public"."FactureClient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reglement" ADD CONSTRAINT "Reglement_factureFournisseurId_fkey" FOREIGN KEY ("factureFournisseurId") REFERENCES "public"."FactureFournisseur"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reglement" ADD CONSTRAINT "Reglement_sourceImportId_fkey" FOREIGN KEY ("sourceImportId") REFERENCES "public"."ImportBanque"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ImportBanqueLigne" ADD CONSTRAINT "ImportBanqueLigne_importBanqueId_fkey" FOREIGN KEY ("importBanqueId") REFERENCES "public"."ImportBanque"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Lettrage" ADD CONSTRAINT "Lettrage_factureClientId_fkey" FOREIGN KEY ("factureClientId") REFERENCES "public"."FactureClient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Lettrage" ADD CONSTRAINT "Lettrage_factureFournisseurId_fkey" FOREIGN KEY ("factureFournisseurId") REFERENCES "public"."FactureFournisseur"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Lettrage" ADD CONSTRAINT "Lettrage_reglementId_fkey" FOREIGN KEY ("reglementId") REFERENCES "public"."Reglement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
