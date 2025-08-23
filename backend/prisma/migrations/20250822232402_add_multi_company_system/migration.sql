/*
  Warnings:

  - You are about to drop the column `budgetActuel` on the `Chantier` table. All the data in the column will be lost.
  - You are about to drop the column `budgetInitial` on the `Chantier` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ConditionsPaiement` table. All the data in the column will be lost.
  - You are about to drop the column `actif` on the `PlanComptable` table. All the data in the column will be lost.
  - You are about to drop the column `categorie` on the `PlanComptable` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `PlanComptable` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `PlanComptable` table. All the data in the column will be lost.
  - You are about to drop the column `journals` on the `Societe` table. All the data in the column will be lost.
  - You are about to drop the column `planComptable` on the `Societe` table. All the data in the column will be lost.
  - You are about to drop the column `tvaIntra` on the `Societe` table. All the data in the column will be lost.
  - You are about to drop the column `tvaMode` on the `Societe` table. All the data in the column will be lost.
  - You are about to drop the column `active` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Attachement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AuditLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BpuPoste` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CessionCreance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ConditionsCommerciales` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ContactFournisseur` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DocumentFournisseur` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExportComptable` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FactureClient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FactureFournisseur` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FournisseurDetails` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HistoriqueQualite` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ImportBanque` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ImportBanqueLigne` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `JournalActionFournisseur` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Lettrage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LitigeFournisseur` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MarcheClient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RefreshToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Reglement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RibFournisseur` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Situation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SituationLigne` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SousTraitanceContrat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SousTraitanceSituation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tiers` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[codeChantier]` on the table `Chantier` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nom]` on the table `Societe` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `adresse` to the `Chantier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `codeChantier` to the `Chantier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `codePostal` to the `Chantier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ville` to the `Chantier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `adresseSiege` to the `Societe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nom` to the `Societe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nom` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prenom` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."DocumentType" AS ENUM ('BON_COMMANDE', 'DEVIS', 'FACTURE', 'AVOIR', 'BON_LIVRAISON', 'BON_RECEPTION', 'ORDRE_SERVICE', 'RAPPORT');

-- CreateEnum
CREATE TYPE "public"."MailType" AS ENUM ('BON_COMMANDE_SENT', 'DEVIS_SENT', 'FACTURE_SENT', 'REMINDER', 'NOTIFICATION', 'CUSTOM');

-- DropForeignKey
ALTER TABLE "public"."Attachement" DROP CONSTRAINT "Attachement_marcheId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Attachement" DROP CONSTRAINT "Attachement_posteId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AuditLog" DROP CONSTRAINT "AuditLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."BpuPoste" DROP CONSTRAINT "BpuPoste_marcheId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CessionCreance" DROP CONSTRAINT "CessionCreance_factureClientId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ConditionsCommerciales" DROP CONSTRAINT "ConditionsCommerciales_conditionsPaiementId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ConditionsCommerciales" DROP CONSTRAINT "ConditionsCommerciales_tiersId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ContactFournisseur" DROP CONSTRAINT "ContactFournisseur_tiersId_fkey";

-- DropForeignKey
ALTER TABLE "public"."DocumentFournisseur" DROP CONSTRAINT "DocumentFournisseur_tiersId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ExportComptable" DROP CONSTRAINT "ExportComptable_societeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."FactureClient" DROP CONSTRAINT "FactureClient_chantierId_fkey";

-- DropForeignKey
ALTER TABLE "public"."FactureClient" DROP CONSTRAINT "FactureClient_tiersId_fkey";

-- DropForeignKey
ALTER TABLE "public"."FactureFournisseur" DROP CONSTRAINT "FactureFournisseur_chantierId_fkey";

-- DropForeignKey
ALTER TABLE "public"."FactureFournisseur" DROP CONSTRAINT "FactureFournisseur_tiersId_fkey";

-- DropForeignKey
ALTER TABLE "public"."FournisseurDetails" DROP CONSTRAINT "FournisseurDetails_compteComptableId_fkey";

-- DropForeignKey
ALTER TABLE "public"."FournisseurDetails" DROP CONSTRAINT "FournisseurDetails_conditionsPaiementId_fkey";

-- DropForeignKey
ALTER TABLE "public"."FournisseurDetails" DROP CONSTRAINT "FournisseurDetails_tiersId_fkey";

-- DropForeignKey
ALTER TABLE "public"."HistoriqueQualite" DROP CONSTRAINT "HistoriqueQualite_tiersId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ImportBanqueLigne" DROP CONSTRAINT "ImportBanqueLigne_importBanqueId_fkey";

-- DropForeignKey
ALTER TABLE "public"."JournalActionFournisseur" DROP CONSTRAINT "JournalActionFournisseur_tiersId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Lettrage" DROP CONSTRAINT "Lettrage_factureClientId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Lettrage" DROP CONSTRAINT "Lettrage_factureFournisseurId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Lettrage" DROP CONSTRAINT "Lettrage_reglementId_fkey";

-- DropForeignKey
ALTER TABLE "public"."LitigeFournisseur" DROP CONSTRAINT "LitigeFournisseur_tiersId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MarcheClient" DROP CONSTRAINT "MarcheClient_chantierId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MarcheClient" DROP CONSTRAINT "MarcheClient_clientId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RefreshToken" DROP CONSTRAINT "RefreshToken_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Reglement" DROP CONSTRAINT "Reglement_factureClientId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Reglement" DROP CONSTRAINT "Reglement_factureFournisseurId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Reglement" DROP CONSTRAINT "Reglement_sourceImportId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RibFournisseur" DROP CONSTRAINT "RibFournisseur_fournisseurDetailsId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Situation" DROP CONSTRAINT "Situation_marcheId_fkey";

-- DropForeignKey
ALTER TABLE "public"."SituationLigne" DROP CONSTRAINT "SituationLigne_posteId_fkey";

-- DropForeignKey
ALTER TABLE "public"."SituationLigne" DROP CONSTRAINT "SituationLigne_situationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."SousTraitanceContrat" DROP CONSTRAINT "SousTraitanceContrat_chantierId_fkey";

-- DropForeignKey
ALTER TABLE "public"."SousTraitanceContrat" DROP CONSTRAINT "SousTraitanceContrat_sousTraitantId_fkey";

-- DropForeignKey
ALTER TABLE "public"."SousTraitanceSituation" DROP CONSTRAINT "SousTraitanceSituation_contratId_fkey";

-- DropIndex
DROP INDEX "public"."PlanComptable_categorie_idx";

-- AlterTable
ALTER TABLE "public"."Chantier" DROP COLUMN "budgetActuel",
DROP COLUMN "budgetInitial",
ADD COLUMN     "adresse" TEXT NOT NULL,
ADD COLUMN     "architecte" TEXT,
ADD COLUMN     "budgetPrevisionnel" DECIMAL(18,2),
ADD COLUMN     "budgetReel" DECIMAL(18,2),
ADD COLUMN     "chefChantier" TEXT,
ADD COLUMN     "clientContact" TEXT,
ADD COLUMN     "clientEmail" TEXT,
ADD COLUMN     "clientNom" TEXT,
ADD COLUMN     "clientTelephone" TEXT,
ADD COLUMN     "codeChantier" TEXT NOT NULL,
ADD COLUMN     "codePostal" TEXT NOT NULL,
ADD COLUMN     "conducteurTravaux" TEXT,
ADD COLUMN     "devise" TEXT NOT NULL DEFAULT 'EUR',
ADD COLUMN     "documentsUrl" TEXT,
ADD COLUMN     "pays" TEXT NOT NULL DEFAULT 'France',
ADD COLUMN     "photosUrl" TEXT,
ADD COLUMN     "plansUrl" TEXT,
ADD COLUMN     "surface" DECIMAL(10,2),
ADD COLUMN     "typeChantier" TEXT,
ADD COLUMN     "uniteSurface" TEXT NOT NULL DEFAULT 'M2',
ADD COLUMN     "ville" TEXT NOT NULL,
ALTER COLUMN "statut" SET DEFAULT 'EN_COURS';

-- AlterTable
ALTER TABLE "public"."ConditionsPaiement" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "public"."PlanComptable" DROP COLUMN "actif",
DROP COLUMN "categorie",
DROP COLUMN "description",
DROP COLUMN "updatedAt",
ADD COLUMN     "typeCompte" TEXT NOT NULL DEFAULT 'FOURNISSEUR';

-- AlterTable
ALTER TABLE "public"."Societe" DROP COLUMN "journals",
DROP COLUMN "planComptable",
DROP COLUMN "tvaIntra",
DROP COLUMN "tvaMode",
ADD COLUMN     "adresseLivraison" TEXT,
ADD COLUMN     "adresseSiege" TEXT NOT NULL,
ADD COLUMN     "capitalSocial" DECIMAL(18,2),
ADD COLUMN     "codeApeNaf" TEXT,
ADD COLUMN     "conditionsGenerales" TEXT,
ADD COLUMN     "contactPrincipal" TEXT,
ADD COLUMN     "devise" TEXT NOT NULL DEFAULT 'EUR',
ADD COLUMN     "email" TEXT,
ADD COLUMN     "enTeteDefaut" TEXT,
ADD COLUMN     "formeJuridique" TEXT,
ADD COLUMN     "fuseauHoraire" TEXT NOT NULL DEFAULT 'Europe/Paris',
ADD COLUMN     "langue" TEXT NOT NULL DEFAULT 'FR',
ADD COLUMN     "logoBase64" TEXT,
ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "nom" TEXT NOT NULL,
ADD COLUMN     "numeroRcs" TEXT,
ADD COLUMN     "piedDePage" TEXT,
ADD COLUMN     "rcs" TEXT,
ADD COLUMN     "serviceAchats" TEXT,
ADD COLUMN     "serviceComptabilite" TEXT,
ADD COLUMN     "siteWeb" TEXT,
ADD COLUMN     "telephone" TEXT,
ADD COLUMN     "tvaIntracommunautaire" TEXT;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "active",
DROP COLUMN "passwordHash",
ADD COLUMN     "actif" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "nom" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "prenom" TEXT NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'USER';

-- DropTable
DROP TABLE "public"."Attachement";

-- DropTable
DROP TABLE "public"."AuditLog";

-- DropTable
DROP TABLE "public"."BpuPoste";

-- DropTable
DROP TABLE "public"."CessionCreance";

-- DropTable
DROP TABLE "public"."ConditionsCommerciales";

-- DropTable
DROP TABLE "public"."ContactFournisseur";

-- DropTable
DROP TABLE "public"."DocumentFournisseur";

-- DropTable
DROP TABLE "public"."ExportComptable";

-- DropTable
DROP TABLE "public"."FactureClient";

-- DropTable
DROP TABLE "public"."FactureFournisseur";

-- DropTable
DROP TABLE "public"."FournisseurDetails";

-- DropTable
DROP TABLE "public"."HistoriqueQualite";

-- DropTable
DROP TABLE "public"."ImportBanque";

-- DropTable
DROP TABLE "public"."ImportBanqueLigne";

-- DropTable
DROP TABLE "public"."JournalActionFournisseur";

-- DropTable
DROP TABLE "public"."Lettrage";

-- DropTable
DROP TABLE "public"."LitigeFournisseur";

-- DropTable
DROP TABLE "public"."MarcheClient";

-- DropTable
DROP TABLE "public"."RefreshToken";

-- DropTable
DROP TABLE "public"."Reglement";

-- DropTable
DROP TABLE "public"."RibFournisseur";

-- DropTable
DROP TABLE "public"."Situation";

-- DropTable
DROP TABLE "public"."SituationLigne";

-- DropTable
DROP TABLE "public"."SousTraitanceContrat";

-- DropTable
DROP TABLE "public"."SousTraitanceSituation";

-- DropTable
DROP TABLE "public"."Tiers";

-- CreateTable
CREATE TABLE "public"."Fournisseur" (
    "id" TEXT NOT NULL,
    "codeFournisseur" TEXT NOT NULL,
    "raisonSociale" TEXT NOT NULL,
    "siret" TEXT,
    "tvaIntracommunautaire" TEXT,
    "codeApeNaf" TEXT,
    "formeJuridique" TEXT,
    "capitalSocial" DECIMAL(18,2),
    "adresseSiege" TEXT,
    "adresseLivraison" TEXT,
    "plafondCredit" DECIMAL(18,2),
    "devise" TEXT NOT NULL DEFAULT 'EUR',
    "estSousTraitant" BOOLEAN NOT NULL DEFAULT false,
    "pasDeTvaGuyane" BOOLEAN NOT NULL DEFAULT false,
    "compteComptable" TEXT,
    "modeReglement" TEXT NOT NULL DEFAULT 'VIR',
    "echeanceType" TEXT NOT NULL DEFAULT '30J',
    "respectEcheance" BOOLEAN NOT NULL DEFAULT true,
    "joursDecalage" INTEGER NOT NULL DEFAULT 30,
    "finDeMois" BOOLEAN NOT NULL DEFAULT false,
    "jourPaiement" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Fournisseur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Contact" (
    "id" TEXT NOT NULL,
    "fournisseurId" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT,
    "email" TEXT,
    "telephone" TEXT,
    "fonction" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BonCommande" (
    "id" TEXT NOT NULL,
    "numeroCommande" TEXT NOT NULL,
    "dateCommande" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateLivraisonSouhaitee" TIMESTAMP(3),
    "demandeurId" TEXT NOT NULL,
    "createurId" TEXT NOT NULL,
    "fournisseurId" TEXT NOT NULL,
    "chantierId" TEXT,
    "statut" TEXT NOT NULL DEFAULT 'DEMANDE',
    "priorite" TEXT NOT NULL DEFAULT 'NORMALE',
    "adresseLivraison" TEXT,
    "conditionsLivraison" TEXT,
    "conditionsPaiement" TEXT,
    "echeancePaiement" TIMESTAMP(3),
    "pdfUrl" TEXT,
    "signatureUrl" TEXT,
    "signatureDate" TIMESTAMP(3),
    "signaturePar" TEXT,
    "emailEnvoye" BOOLEAN NOT NULL DEFAULT false,
    "emailDateEnvoi" TIMESTAMP(3),
    "emailDestinataire" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BonCommande_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ArticleCommande" (
    "id" TEXT NOT NULL,
    "bonCommandeId" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "quantite" DECIMAL(10,3) NOT NULL,
    "unite" TEXT NOT NULL DEFAULT 'U',
    "description" TEXT,
    "prixUnitaire" DECIMAL(18,4),
    "devise" TEXT NOT NULL DEFAULT 'EUR',
    "justification" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArticleCommande_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."companies" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "legalName" TEXT,
    "siret" TEXT,
    "tvaNumber" TEXT,
    "address" TEXT,
    "postalCode" TEXT,
    "city" TEXT,
    "country" TEXT DEFAULT 'FR',
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "timezone" TEXT NOT NULL DEFAULT 'Europe/Paris',
    "locale" TEXT NOT NULL DEFAULT 'fr-FR',
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."branding" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "primaryColor" TEXT NOT NULL DEFAULT '#1E40AF',
    "secondaryColor" TEXT NOT NULL DEFAULT '#059669',
    "accentColor" TEXT NOT NULL DEFAULT '#DC2626',
    "textColor" TEXT NOT NULL DEFAULT '#1F2937',
    "backgroundColor" TEXT NOT NULL DEFAULT '#F9FAFB',
    "logoUrl" TEXT,
    "logoDarkUrl" TEXT,
    "faviconUrl" TEXT,
    "primaryFont" TEXT NOT NULL DEFAULT 'Inter',
    "secondaryFont" TEXT NOT NULL DEFAULT 'Georgia',
    "showLogoInDocuments" BOOLEAN NOT NULL DEFAULT true,
    "showCompanyInfoInFooter" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "branding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."templates" (
    "id" TEXT NOT NULL,
    "companyId" TEXT,
    "name" TEXT NOT NULL,
    "type" "public"."DocumentType" NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "html" TEXT NOT NULL,
    "css" TEXT,
    "js" TEXT,
    "description" TEXT,
    "tags" TEXT[],
    "fallbackTemplateId" TEXT,
    "pageSize" TEXT NOT NULL DEFAULT 'A4',
    "orientation" TEXT NOT NULL DEFAULT 'portrait',
    "margins" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."template_versions" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "html" TEXT NOT NULL,
    "css" TEXT,
    "js" TEXT,
    "modifiedBy" TEXT,
    "changeReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "template_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."numbering_rules" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "documentType" "public"."DocumentType" NOT NULL,
    "prefix" TEXT,
    "format" TEXT NOT NULL,
    "separator" TEXT NOT NULL DEFAULT '-',
    "startNumber" INTEGER NOT NULL DEFAULT 1,
    "increment" INTEGER NOT NULL DEFAULT 1,
    "padding" INTEGER NOT NULL DEFAULT 4,
    "availableVariables" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "numbering_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."mail_templates" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."MailType" NOT NULL,
    "subject" TEXT NOT NULL,
    "htmlBody" TEXT NOT NULL,
    "textBody" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "cc" TEXT[],
    "bcc" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mail_templates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Fournisseur_codeFournisseur_key" ON "public"."Fournisseur"("codeFournisseur");

-- CreateIndex
CREATE INDEX "Fournisseur_codeFournisseur_idx" ON "public"."Fournisseur"("codeFournisseur");

-- CreateIndex
CREATE INDEX "Fournisseur_siret_idx" ON "public"."Fournisseur"("siret");

-- CreateIndex
CREATE INDEX "Contact_fournisseurId_idx" ON "public"."Contact"("fournisseurId");

-- CreateIndex
CREATE UNIQUE INDEX "BonCommande_numeroCommande_key" ON "public"."BonCommande"("numeroCommande");

-- CreateIndex
CREATE INDEX "BonCommande_numeroCommande_idx" ON "public"."BonCommande"("numeroCommande");

-- CreateIndex
CREATE INDEX "BonCommande_dateCommande_idx" ON "public"."BonCommande"("dateCommande");

-- CreateIndex
CREATE INDEX "BonCommande_statut_idx" ON "public"."BonCommande"("statut");

-- CreateIndex
CREATE INDEX "BonCommande_fournisseurId_idx" ON "public"."BonCommande"("fournisseurId");

-- CreateIndex
CREATE INDEX "BonCommande_chantierId_idx" ON "public"."BonCommande"("chantierId");

-- CreateIndex
CREATE INDEX "BonCommande_demandeurId_idx" ON "public"."BonCommande"("demandeurId");

-- CreateIndex
CREATE INDEX "ArticleCommande_bonCommandeId_idx" ON "public"."ArticleCommande"("bonCommandeId");

-- CreateIndex
CREATE UNIQUE INDEX "companies_code_key" ON "public"."companies"("code");

-- CreateIndex
CREATE UNIQUE INDEX "branding_companyId_key" ON "public"."branding"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "templates_companyId_type_version_key" ON "public"."templates"("companyId", "type", "version");

-- CreateIndex
CREATE UNIQUE INDEX "template_versions_templateId_version_key" ON "public"."template_versions"("templateId", "version");

-- CreateIndex
CREATE UNIQUE INDEX "numbering_rules_companyId_documentType_key" ON "public"."numbering_rules"("companyId", "documentType");

-- CreateIndex
CREATE UNIQUE INDEX "mail_templates_companyId_type_key" ON "public"."mail_templates"("companyId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Chantier_codeChantier_key" ON "public"."Chantier"("codeChantier");

-- CreateIndex
CREATE INDEX "Chantier_codeChantier_idx" ON "public"."Chantier"("codeChantier");

-- CreateIndex
CREATE INDEX "Chantier_statut_idx" ON "public"."Chantier"("statut");

-- CreateIndex
CREATE INDEX "Chantier_dateDebut_idx" ON "public"."Chantier"("dateDebut");

-- CreateIndex
CREATE INDEX "Chantier_clientNom_idx" ON "public"."Chantier"("clientNom");

-- CreateIndex
CREATE INDEX "PlanComptable_typeCompte_idx" ON "public"."PlanComptable"("typeCompte");

-- CreateIndex
CREATE UNIQUE INDEX "Societe_nom_key" ON "public"."Societe"("nom");

-- CreateIndex
CREATE INDEX "Societe_nom_idx" ON "public"."Societe"("nom");

-- CreateIndex
CREATE INDEX "Societe_siret_idx" ON "public"."Societe"("siret");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "public"."User"("role");

-- AddForeignKey
ALTER TABLE "public"."Contact" ADD CONSTRAINT "Contact_fournisseurId_fkey" FOREIGN KEY ("fournisseurId") REFERENCES "public"."Fournisseur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BonCommande" ADD CONSTRAINT "BonCommande_demandeurId_fkey" FOREIGN KEY ("demandeurId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BonCommande" ADD CONSTRAINT "BonCommande_createurId_fkey" FOREIGN KEY ("createurId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BonCommande" ADD CONSTRAINT "BonCommande_fournisseurId_fkey" FOREIGN KEY ("fournisseurId") REFERENCES "public"."Fournisseur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BonCommande" ADD CONSTRAINT "BonCommande_chantierId_fkey" FOREIGN KEY ("chantierId") REFERENCES "public"."Chantier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ArticleCommande" ADD CONSTRAINT "ArticleCommande_bonCommandeId_fkey" FOREIGN KEY ("bonCommandeId") REFERENCES "public"."BonCommande"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."branding" ADD CONSTRAINT "branding_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."templates" ADD CONSTRAINT "templates_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."templates" ADD CONSTRAINT "templates_fallbackTemplateId_fkey" FOREIGN KEY ("fallbackTemplateId") REFERENCES "public"."templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."template_versions" ADD CONSTRAINT "template_versions_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "public"."templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."numbering_rules" ADD CONSTRAINT "numbering_rules_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."mail_templates" ADD CONSTRAINT "mail_templates_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
