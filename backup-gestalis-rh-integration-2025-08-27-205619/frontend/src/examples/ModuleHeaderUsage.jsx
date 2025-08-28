import React from 'react';
import ModuleHeader from '../components/layout/ModuleHeader';
import { 
  Home, 
  Building2, 
  FileText, 
  ShoppingCart,
  CreditCard,
  Users,
  TrendingUp,
  Package,
  Brain,
  UserCheck,
  BarChart3,
  Settings
} from 'lucide-react';

// Exemples d'utilisation du ModuleHeader pour chaque module
export const ModuleHeaderExamples = () => {
  return (
    <div className="space-y-8 p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Exemples d'utilisation du ModuleHeader
      </h1>

      {/* Dashboard */}
      <ModuleHeader
        moduleKey="dashboard"
        title="Tableau de Bord"
        description="Vue d'ensemble et actions rapides"
        icon={<Home className="h-5 w-5" />}
        actions={
          <div className="flex gap-2">
            <button className="px-3 py-2 bg-white/15 border border-white/20 rounded-lg text-white hover:bg-white/25">
              Actualiser
            </button>
            <button className="px-3 py-2 bg-white/15 border border-white/20 rounded-lg text-white hover:bg-white/25">
              Configurer
            </button>
          </div>
        }
      />

      {/* Chantiers */}
      <ModuleHeader
        moduleKey="chantiers"
        title="Module Chantiers"
        description="Gestion des chantiers et suivi des travaux"
        icon={<Building2 className="h-5 w-5" />}
        actions={
          <div className="flex gap-2">
            <button className="px-3 py-2 bg-white/15 border border-white/20 rounded-lg text-white hover:bg-white/25">
              Nouveau chantier
            </button>
            <button className="px-3 py-2 bg-white/15 border border-white/20 rounded-lg text-white hover:bg-white/25">
              Planning
            </button>
          </div>
        }
      />

      {/* Vente */}
      <ModuleHeader
        moduleKey="vente"
        title="Module Vente"
        description="Gestion des devis, factures et suivi commercial"
        icon={<FileText className="h-5 w-5" />}
        actions={
          <div className="flex gap-2">
            <button className="px-3 py-2 bg-white/15 border border-white/20 rounded-lg text-white hover:bg-white/25">
              Nouveau devis
            </button>
            <button className="px-3 py-2 bg-white/15 border border-white/20 rounded-lg text-white hover:bg-white/25">
              Facturer
            </button>
          </div>
        }
      />

      {/* Achats */}
      <ModuleHeader
        moduleKey="achats"
        title="Module Achats"
        description="Gestion des fournisseurs, commandes et factures"
        icon={<ShoppingCart className="h-5 w-5" />}
        actions={
          <div className="flex gap-2">
            <button className="px-3 py-2 bg-white/15 border border-white/20 rounded-lg text-white hover:bg-white/25">
              Nouveau fournisseur
            </button>
            <button className="px-3 py-2 bg-white/15 border border-white/20 rounded-lg text-white hover:bg-white/25">
              Bon de commande
            </button>
          </div>
        }
      />

      {/* Gestion Commerciale */}
      <ModuleHeader
        moduleKey="commercial"
        title="Module Gestion Commerciale"
        description="Analyse de rentabilité et KPI commerciaux"
        icon={<TrendingUp className="h-5 w-5" />}
        actions={
          <div className="flex gap-2">
            <button className="px-3 py-2 bg-white/15 border border-white/20 rounded-lg text-white hover:bg-white/25">
              Analyse
            </button>
            <button className="px-3 py-2 bg-white/15 border border-white/20 rounded-lg text-white hover:bg-white/25">
              Rapport
            </button>
          </div>
        }
      />

      {/* Trésorerie */}
      <ModuleHeader
        moduleKey="tresorerie"
        title="Module Trésorerie"
        description="Gestion des règlements et trésorerie"
        icon={<CreditCard className="h-5 w-5" />}
        actions={
          <div className="flex gap-2">
            <button className="px-3 py-2 bg-white/15 border border-white/20 rounded-lg text-white hover:bg-white/25">
              Import bancaire
            </button>
            <button className="px-3 py-2 bg-white/15 border border-white/20 rounded-lg text-white hover:bg-white/25">
              Lettrage
            </button>
          </div>
        }
      />

      {/* Tiers */}
      <ModuleHeader
        moduleKey="tiers"
        title="Module Tiers"
        description="Gestion des clients et fournisseurs"
        icon={<Users className="h-5 w-5" />}
        actions={
          <div className="flex gap-2">
            <button className="px-3 py-2 bg-white/15 border border-white/20 rounded-lg text-white hover:bg-white/25">
              Nouveau tiers
            </button>
            <button className="px-3 py-2 bg-white/15 border border-white/20 rounded-lg text-white hover:bg-white/25">
              Communication
            </button>
          </div>
        }
      />

      {/* RH */}
      <ModuleHeader
        moduleKey="rh"
        title="Module Ressources Humaines"
        description="Gestion des salariés et planning"
        icon={<UserCheck className="h-5 w-5" />}
        actions={
          <div className="flex gap-2">
            <button className="px-3 py-2 bg-white/15 border border-white/20 rounded-lg text-white hover:bg-white/25">
              Nouveau salarié
            </button>
            <button className="px-3 py-2 bg-white/15 border border-white/20 rounded-lg text-white hover:bg-white/25">
              Planning
            </button>
          </div>
        }
      />

      {/* Analyse */}
      <ModuleHeader
        moduleKey="analyse"
        title="Module Analyse & Reporting"
        description="KPI personnalisés et rapports"
        icon={<BarChart3 className="h-5 w-5" />}
        actions={
          <div className="flex gap-2">
            <button className="px-3 py-2 bg-white/15 border border-white/20 rounded-lg text-white hover:bg-white/25">
              Nouveau KPI
            </button>
            <button className="px-3 py-2 bg-white/15 border border-white/20 rounded-lg text-white hover:bg-white/25">
              Rapport
            </button>
          </div>
        }
      />

      {/* Logistique */}
      <ModuleHeader
        moduleKey="logistique"
        title="Module Logistique & Stocks"
        description="Gestion des matériaux et livraisons"
        icon={<Package className="h-5 w-5" />}
        actions={
          <div className="flex gap-2">
            <button className="px-3 py-2 bg-white/15 border border-white/20 rounded-lg text-white hover:bg-white/25">
              Nouveau matériau
            </button>
            <button className="px-3 py-2 bg-white/15 border border-white/20 rounded-lg text-white hover:bg-white/25">
              Livraison
            </button>
          </div>
        }
      />

      {/* IA */}
      <ModuleHeader
        moduleKey="ia"
        title="Module Automatisation & IA"
        description="OCR, analyse photos et prédictions"
        icon={<Brain className="h-5 w-5" />}
        actions={
          <div className="flex gap-2">
            <button className="px-3 py-2 bg-white/15 border border-white/20 rounded-lg text-white hover:bg-white/25">
              OCR
            </button>
            <button className="px-3 py-2 bg-white/15 border border-white/20 rounded-lg text-white hover:bg-white/25">
              Analyse IA
            </button>
          </div>
        }
      />

      {/* Admin */}
      <ModuleHeader
        moduleKey="admin"
        title="Module Administration"
        description="Paramètres et gestion système"
        icon={<Settings className="h-5 w-5" />}
        actions={
          <div className="flex gap-2">
            <button className="px-3 py-2 bg-white/15 border border-white/20 rounded-lg text-white hover:bg-white/25">
              Paramètres
            </button>
            <button className="px-3 py-2 bg-white/15 border border-white/20 rounded-lg text-white hover:bg-white/25">
              Sécurité
            </button>
          </div>
        }
      />
    </div>
  );
};

export default ModuleHeaderExamples;

