import React, { useState, useEffect } from 'react';
import { GestalisCard, GestalisCardContent, GestalisCardHeader, GestalisCardTitle } from '../components/ui/GestalisCard';
import { GestalisButton } from '../components/ui/gestalis-button';
import { createClient } from '@supabase/supabase-js';
import { 
  Building2, 
  ShoppingCart, 
  Users,
  TrendingUp,
  DollarSign,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  Package,
  Truck,
  Calendar,
  BarChart3,
  Plus,
  Eye,
  Download,
  RefreshCw,
  Bell,
  Settings,
  Sparkles,
  Home,
  FileText,
  Calculator,
  Database,
  ArrowRight,
  CheckCircle as CheckCircleIcon,
  AlertCircle
} from 'lucide-react';
import { DashboardBanner } from '../components/layout/ModuleBanner';

// Configuration Supabase
const supabase = createClient(
  'https://esczdkgknrozwovlfbki.supabase.co',
  '9uGziNgoG46oYBg0plVBKEYxEp8uO-zCA'
);

// Fonction de migration automatique
const migrerVersSupabase = async () => {
  if (!supabase) {
    alert('❌ Erreur : Supabase non disponible');
    return;
  }

  try {
    console.log('🚀 DÉBUT DE LA MIGRATION AUTOMATIQUE...');
    
    // Migration des fournisseurs
    const fournisseursData = localStorage.getItem('fournisseurs');
    if (fournisseursData) {
      const fournisseurs = JSON.parse(fournisseursData);
      console.log(`📊 Migration de ${fournisseurs.length} fournisseurs...`);
      
      for (const fournisseur of fournisseurs) {
        const { error } = await supabase.from('fournisseurs').insert({
          code_fournisseur: fournisseur.codeFournisseur || fournisseur.code,
          raison_sociale: fournisseur.raisonSociale || fournisseur.nom,
          siret: fournisseur.siret,
          adresse: fournisseur.adresse,
          code_postal: fournisseur.codePostal,
          ville: fournisseur.ville,
          pays: fournisseur.pays || 'France',
          telephone: fournisseur.telephone,
          email: fournisseur.email,
          contact_principal: fournisseur.contactPrincipal,
          conditions_paiement: fournisseur.conditionsPaiement,
          notes: fournisseur.notes,
          statut: fournisseur.statut || 'actif'
        });
        
        if (error) console.error(`❌ Erreur fournisseur ${fournisseur.codeFournisseur}:`, error);
        else console.log(`✅ Fournisseur migré: ${fournisseur.codeFournisseur}`);
      }
    }
    
    // Migration des chantiers
    const chantiersData = localStorage.getItem('chantiers');
    if (chantiersData) {
      const chantiers = JSON.parse(chantiersData);
      console.log(`📊 Migration de ${chantiers.length} chantiers...`);
      
      for (const chantier of chantiers) {
        const { error } = await supabase.from('chantiers').insert({
          code: chantier.code,
          numero_externe: chantier.numeroExterne,
          nom: chantier.nom,
          description: chantier.description,
          adresse: chantier.adresse,
          code_postal: chantier.codePostal,
          ville: chantier.ville,
          client: chantier.client,
          date_debut: chantier.dateDebut,
          date_fin_prevue: chantier.dateFinPrevue,
          date_fin_reelle: chantier.dateFinReelle,
          montant_ht: chantier.montant,
          montant_ttc: chantier.montant,
          statut: chantier.statut || 'en_cours',
          chef_chantier: chantier.chefChantier,
          notes: chantier.notes
        });
        
        if (error) console.error(`❌ Erreur chantier ${chantier.code}:`, error);
        else console.log(`✅ Chantier migré: ${chantier.code}`);
      }
    }
    
    // Migration des cessions
    const cessionsData = localStorage.getItem('cessions');
    if (cessionsData) {
      const cessions = JSON.parse(cessionsData);
      console.log(`📊 Migration de ${cessions.length} cessions...`);
      
      for (const cession of cessions) {
        const { error } = await supabase.from('cessions_creance').insert({
          reference: cession.reference,
          date_cession: cession.dateCession,
          montant: cession.montant,
          client: cession.client,
          chantier: cession.chantier,
          fournisseur: cession.fournisseur,
          statut: cession.statut || 'en_cours',
          notes: cession.notes
        });
        
        if (error) console.error(`❌ Erreur cession ${cession.reference}:`, error);
        else console.log(`✅ Cession migrée: ${cession.reference}`);
      }
    }
    
    // Migration des produits
    const produitsData = localStorage.getItem('produits');
    if (produitsData) {
      const produits = JSON.parse(produitsData);
      console.log(`📊 Migration de ${produits.length} produits...`);
      
      for (const produit of produits) {
        const { error } = await supabase.from('produits').insert({
          code: produit.code,
          nom: produit.nom,
          description: produit.description,
          prix_ht: produit.prixHT,
          prix_ttc: produit.prixTTC,
          unite: produit.unite,
          categorie_id: produit.categorieId || 1,
          fournisseur_id: produit.fournisseurId,
          statut: produit.statut || 'actif'
        });
        
        if (error) console.error(`❌ Erreur produit ${produit.code}:`, error);
        else console.log(`✅ Produit migré: ${produit.code}`);
      }
    }
    
    // Migration des factures
    const facturesData = localStorage.getItem('factures');
    if (facturesData) {
      const factures = JSON.parse(facturesData);
      console.log(`📊 Migration de ${factures.length} factures...`);
      
      for (const facture of factures) {
        const { error } = await supabase.from('factures').insert({
          numero: facture.numero,
          date_facture: facture.dateFacture,
          date_echeance: facture.dateEcheance,
          fournisseur_id: facture.fournisseurId,
          chantier_id: facture.chantierId,
          montant_ht: facture.montantHT,
          montant_ttc: facture.montantTTC,
          statut: facture.statut || 'en_attente',
          notes: facture.notes
        });
        
        if (error) console.error(`❌ Erreur facture ${facture.numero}:`, error);
        else console.log(`✅ Facture migrée: ${facture.numero}`);
      }
    }
    
    console.log('=====================================');
    console.log('✅ MIGRATION AUTOMATIQUE TERMINÉE !');
    console.log('🎯 Votre application est maintenant connectée à Supabase !');
    
    // Notification de succès
    alert('🎉 Migration vers Supabase terminée avec succès !');
    
  } catch (error) {
    console.error('❌ ERREUR LORS DE LA MIGRATION:', error);
    alert('❌ Erreur lors de la migration. Vérifiez la console.');
  }
};

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Données réelles des KPI (à connecter à votre backend)
  const [kpiData, setKpiData] = useState({
    ca: 1250000,
    chantiers: 12,
    fournisseurs: 45,
    commandes: 28,
    factures: 156,
    tauxSatisfaction: 94.2,
    retardMoyen: 2.3,
    margeMoyenne: 18.5
  });

  // Alertes et notifications
  const [alertes, setAlertes] = useState([
    {
      id: 1,
      type: 'warning',
      title: 'Chantier en retard',
      message: 'Chantier Rue de la Paix - 3 jours de retard',
      time: 'Il y a 2h',
      priority: 'high'
    },
    {
      id: 2,
      type: 'info',
      title: 'Nouvelle commande',
      message: 'Commande BC-00123 validée - €45,000',
      time: 'Il y a 4h',
      priority: 'medium'
    },
    {
      id: 3,
      type: 'success',
      title: 'Paiement reçu',
      message: 'Facture FA-001234 - €18,500 reçue',
      time: 'Il y a 6h',
      priority: 'low'
    }
  ]);

  // Activités récentes
  const [activites, setActivites] = useState([
    {
      id: 1,
      type: 'chantier',
      title: 'Fondations terminées',
      description: 'Chantier Centre Commercial - 75%',
      time: 'Il y a 1h',
      icon: Building2,
      color: 'text-blue-600'
    },
    {
      id: 2,
      type: 'commande',
      title: 'Matériaux livrés',
      description: 'Commande BC-001 - BTP Plus',
      time: 'Il y a 3h',
      icon: ShoppingCart,
      color: 'text-green-600'
    },
    {
      id: 3,
      type: 'fournisseur',
      title: 'Nouveau fournisseur',
      description: 'BTP Matériaux ajouté',
      time: 'Il y a 5h',
      icon: Users,
      color: 'text-purple-600'
    }
  ]);

  // Fonction de rafraîchissement
  const refreshData = async () => {
    setIsLoading(true);
    // Simuler un appel API
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastUpdate(new Date());
    setIsLoading(false);
  };

  // Calcul des variations (simulation)
  const variations = {
    ca: '+12.5%',
    chantiers: '+8.3%',
    fournisseurs: '+15.2%',
    commandes: '+22.1%'
  };

  // Couleurs des alertes
  const getAlertColor = (type) => {
    switch (type) {
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'success': return 'bg-green-50 border-green-200 text-green-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  // Icônes des alertes
  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning': return AlertTriangle;
      case 'info': return Bell;
      case 'success': return CheckCircle;
      default: return Bell;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* DashboardBanner avec le nouveau système typographique unifié */}
      <div className="px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <DashboardBanner
            description={`Dernière mise à jour: ${lastUpdate.toLocaleTimeString('fr-FR')}`}
          >
            <div className="flex items-center gap-4">
              <button
                onClick={refreshData}
                disabled={isLoading}
                className="btn btn-primary"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Actualiser
              </button>
              
              <button className="btn btn-primary">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </button>
              
              <button className="btn btn-primary">
                <Settings className="h-4 w-4 mr-2" />
                Configurer
              </button>
          </div>
          </DashboardBanner>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        
        {/* KPI principaux */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Indicateurs de performance</h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              Mise à jour en temps réel
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* CA */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  {variations.ca}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Chiffre d'affaires</h3>
              <p className="text-2xl font-bold text-gray-900">€{(kpiData.ca / 1000000).toFixed(1)}M</p>
              <p className="text-sm text-gray-500 mt-1">Cette année</p>
        </div>

            {/* Chantiers */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                  {variations.chantiers}
                    </span>
                  </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Chantiers actifs</h3>
              <p className="text-2xl font-bold text-gray-900">{kpiData.chantiers}</p>
              <p className="text-sm text-gray-500 mt-1">En cours</p>
            </div>

            {/* Fournisseurs */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                  {variations.fournisseurs}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Fournisseurs</h3>
              <p className="text-2xl font-bold text-gray-900">{kpiData.fournisseurs}</p>
              <p className="text-sm text-gray-500 mt-1">Partenaire</p>
            </div>

            {/* Satisfaction */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <Award className="h-6 w-6 text-orange-600" />
                </div>
                <span className="text-sm font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                  +2.1%
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Satisfaction client</h3>
              <p className="text-2xl font-bold text-gray-900">{kpiData.tauxSatisfaction}%</p>
              <p className="text-sm text-gray-500 mt-1">Excellent</p>
            </div>
          </div>
        </section>

        {/* Graphiques et métriques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Évolution CA */}
          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Évolution du CA</h3>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                Voir détails
              </button>
        </div>

            <div className="space-y-4">
              {/* Graphique simple */}
              <div className="flex items-end justify-between h-32 space-x-2">
                {[
                  { month: 'Jan', ca: 85000 },
                  { month: 'Fév', ca: 92000 },
                  { month: 'Mar', ca: 105000 },
                  { month: 'Avr', ca: 118000 },
                  { month: 'Mai', ca: 125000 },
                  { month: 'Juin', ca: 135000 }
                ].map((data, index) => (
                  <div key={index} className="flex flex-col items-center space-y-2">
                    <div 
                      className="w-8 bg-gradient-to-t from-blue-500 to-teal-600 rounded-t-lg transition-all duration-300 hover:opacity-80"
                      style={{ height: `${(data.ca / 150000) * 120}px` }}
                    />
                    <span className="text-xs text-gray-600 font-medium">{data.month}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Progression: +58.8%</span>
                <span>Objectif: €150K</span>
              </div>
            </div>
          </section>

          {/* Métriques secondaires */}
          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Métriques clés</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Commandes en cours</span>
                </div>
                <span className="text-lg font-bold text-gray-900">{kpiData.commandes}</span>
                </div>
                
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Livraisons ce mois</span>
                </div>
                <span className="text-lg font-bold text-gray-900">24</span>
              </div>
                      
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">Marge moyenne</span>
                      </div>
                <span className="text-lg font-bold text-gray-900">{kpiData.margeMoyenne}%</span>
                    </div>
                  </div>
          </section>
          </div>
          
        {/* Alertes et notifications */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Alertes et notifications</h2>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              Voir toutes
            </button>
        </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {alertes.map((alerte) => {
              const IconComponent = getAlertIcon(alerte.type);
                return (
                  <div
                  key={alerte.id}
                  className={`p-4 border rounded-lg ${getAlertColor(alerte.type)} transition-all duration-200 hover:shadow-md cursor-pointer`}
                >
                  <div className="flex items-start gap-3">
                    <IconComponent className="h-5 w-5 mt-0.5" />
                    <div className="flex-1 space-y-1">
                      <h4 className="font-medium">{alerte.title}</h4>
                      <p className="text-sm opacity-90">{alerte.message}</p>
                      <p className="text-xs opacity-75">{alerte.time}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Activités récentes */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Activités récentes</h2>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                Voir tout
            </button>
              </div>
            
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="space-y-4">
              {activites.map((activite) => {
                const IconComponent = activite.icon;
                return (
                  <div key={activite.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <IconComponent className={`h-5 w-5 ${activite.color}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{activite.title}</h4>
                      <p className="text-sm text-gray-600">{activite.description}</p>
                    </div>
                    <span className="text-xs text-gray-500">{activite.time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Actions rapides */}
        <section className="text-center space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Actions rapides</h2>
          
          <div className="flex flex-wrap justify-center gap-4">
            <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1B275A] to-[#06B6D4] text-white rounded-lg hover:from-[#3C7DD9] hover:to-[#0891B2] transition-all duration-300 hover:scale-105">
              <Plus className="h-5 w-5" />
              Nouveau chantier
            </button>
            
            <button className="flex items-center gap-2 px-6 py-3 border-2 border-blue-500 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 hover:scale-105">
              <ShoppingCart className="h-5 w-5" />
              Nouvelle commande
            </button>
            
            <button className="flex items-center gap-2 px-6 py-3 border-2 border-teal-500 text-teal-600 hover:bg-teal-50 rounded-lg transition-all duration-300 hover:scale-105">
              <Users className="h-5 w-5" />
              Nouveau fournisseur
            </button>
            
            <button className="flex items-center gap-2 px-6 py-3 border-2 border-purple-500 text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-300 hover:scale-105">
              <BarChart3 className="h-5 w-5" />
              Voir rapports
            </button>
          </div>
        </section>

        {/* Migration vers Supabase */}
        <section className="text-center space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Migration vers Supabase</h2>
          <p className="text-lg text-gray-700">
            Veuillez cliquer sur le bouton ci-dessous pour déclencher la migration de vos données locales vers Supabase.
            Cela permettra de synchroniser vos données entre votre application et la base de données.
          </p>
          <GestalisButton
            onClick={migrerVersSupabase}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105"
          >
            <Database className="h-5 w-5" />
            Déclencher la migration
          </GestalisButton>
        </section>
      </div>
    </div>
  );
};

export default Dashboard; 