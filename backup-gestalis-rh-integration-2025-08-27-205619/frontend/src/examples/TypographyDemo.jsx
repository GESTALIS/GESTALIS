import React from 'react';
import { 
  DashboardBanner, 
  AchatsBanner, 
  ChantiersBanner,
  VenteBanner,
  TresorerieBanner,
  TiersBanner,
  RHBanner,
  AnalyseBanner,
  LogistiqueBanner,
  IABanner,
  AdminBanner
} from '../components/layout/ModuleBanner';
import { BonCommandeTable, FactureTable, sampleBonCommandeData, sampleFactureData } from '../components/documents/DocumentTable';

/**
 * Page de démonstration du système typographique unifié GESTALIS
 * Montre toutes les bannières et composants
 */
export default function TypographyDemo() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Titre principal */}
        <div className="text-center mb-12">
          <h1>🎨 Système Typographique Unifié GESTALIS</h1>
          <p className="text-xl text-gray-600 mt-4">
            Police Inter Variable + Bannières standardisées + Couleurs PRO 97
          </p>
        </div>

        {/* Section Bannières */}
        <section>
          <h2>📋 Bannières de Modules Standardisées</h2>
          <p className="text-gray-600 mb-6">
            Toutes les bannières utilisent la même police Inter Variable et les couleurs PRO 97
          </p>
          
          <div className="space-y-6">
            <DashboardBanner description="Vue d'ensemble et KPIs clés">
              <button className="btn btn-primary">Actions rapides</button>
            </DashboardBanner>

            <AchatsBanner description="Gestion des fournisseurs, commandes et factures">
              <button className="btn btn-primary">Nouveau fournisseur</button>
            </AchatsBanner>

            <ChantiersBanner description="Gestion des chantiers et suivi des travaux">
              <button className="btn btn-primary">Nouveau chantier</button>
            </ChantiersBanner>

            <VenteBanner description="Gestion des devis, factures et suivi commercial">
              <button className="btn btn-primary">Nouveau devis</button>
            </VenteBanner>

            <TresorerieBanner description="Gestion des règlements et trésorerie">
              <button className="btn btn-primary">Import bancaire</button>
            </TresorerieBanner>

            <TiersBanner description="Gestion des clients et fournisseurs">
              <button className="btn btn-primary">Nouveau tiers</button>
            </TiersBanner>

            <RHBanner description="Gestion des salariés et planning">
              <button className="btn btn-primary">Nouveau salarié</button>
            </RHBanner>

            <AnalyseBanner description="KPI personnalisés et rapports">
              <button className="btn btn-primary">Nouveau KPI</button>
            </AnalyseBanner>

            <LogistiqueBanner description="Gestion des matériaux et livraisons">
              <button className="btn btn-primary">Nouveau matériau</button>
            </LogistiqueBanner>

            <IABanner description="OCR, analyse photos et prédictions">
              <button className="btn btn-primary">Analyse IA</button>
            </IABanner>

            <AdminBanner description="Paramètres et gestion système">
              <button className="btn btn-primary">Paramètres</button>
            </AdminBanner>
          </div>
        </section>

        {/* Section Boutons */}
        <section>
          <h2>🔘 Boutons et Interactions</h2>
          <p className="text-gray-600 mb-6">
            Boutons avec police Inter Variable et couleurs PRO 97
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button className="btn btn-primary">Bouton Principal</button>
            <button className="btn btn-danger">Bouton Danger</button>
            <button className="btn" style={{ background: '#64748B', color: 'white' }}>
              Bouton Secondaire
            </button>
          </div>
        </section>

        {/* Section Tables Documents */}
        <section>
          <h2>📊 Tables pour Documents (BC & Factures)</h2>
          <p className="text-gray-600 mb-6">
            Tables avec alignement parfait des montants grâce à tabular-nums
          </p>
          
          <div className="space-y-8">
            <div>
              <h3>Bon de Commande</h3>
              <BonCommandeTable data={sampleBonCommandeData} />
            </div>
            
            <div>
              <h3>Facture</h3>
              <FactureTable data={sampleFactureData} />
            </div>
          </div>
        </section>

        {/* Section Typographie */}
        <section>
          <h2>🔤 Échelle Typographique</h2>
          <p className="text-gray-600 mb-6">
            Hiérarchie typographique responsive avec Inter Variable
          </p>
          
          <div className="space-y-4">
            <h1>Titre H1 - Police Inter Variable, 700, 2.4rem</h1>
            <h2>Titre H2 - Police Inter Variable, 600, 1.8rem</h2>
            <h3>Titre H3 - Police Inter Variable, 600, 1.4rem</h3>
            <p>Paragraphe - Police Inter Variable, 400, 1rem, line-height 1.6</p>
            <p className="text-gray-600">Texte secondaire avec couleur muted</p>
          </div>
        </section>

        {/* Section Couleurs */}
        <section>
          <h2>🎨 Palette de Couleurs PRO 97</h2>
          <p className="text-gray-600 mb-6">
            Variables CSS centralisées pour la cohérence
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-20 h-20 rounded-lg mx-auto mb-2" style={{ background: 'var(--brand-1)' }}></div>
              <p className="text-sm font-medium">Brand 1</p>
              <p className="text-xs text-gray-500">#0B3D91</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 rounded-lg mx-auto mb-2" style={{ background: 'var(--brand-2)' }}></div>
              <p className="text-sm font-medium">Brand 2</p>
              <p className="text-xs text-gray-500">#F89032</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 rounded-lg mx-auto mb-2" style={{ background: 'var(--brand-3)' }}></div>
              <p className="text-sm font-medium">Brand 3</p>
              <p className="text-xs text-gray-500">#BA8A36</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 rounded-lg mx-auto mb-2" style={{ background: 'var(--danger)' }}></div>
              <p className="text-sm font-medium">Danger</p>
              <p className="text-xs text-gray-500">#D92D20</p>
            </div>
          </div>
        </section>

        {/* Section Impression */}
        <section>
          <h2>🖨️ Styles d'Impression</h2>
          <p className="text-gray-600 mb-6">
            Optimisé pour l'impression A4 et la génération PDF
          </p>
          
          <div className="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-sm text-gray-600 mb-4">
              Cette section simule l'apparence à l'impression
            </p>
            <p className="text-sm">
              • Police Inter Variable conservée<br/>
              • Couleurs adaptées pour l'impression<br/>
              • Marges A4 optimisées (14mm)<br/>
              • Tables avec bordures visibles
            </p>
          </div>
        </section>

        {/* Section Responsive */}
        <section>
          <h2>📱 Design Responsive</h2>
          <p className="text-gray-600 mb-6">
            Adaptation automatique sur tous les écrans
          </p>
          
          <div className="bg-white p-6 rounded-lg">
            <p className="text-sm">
              • Bannières s'adaptent aux petits écrans<br/>
              • Typographie responsive avec clamp()<br/>
              • Boutons et tables optimisés mobile<br/>
              • Espacement adaptatif
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}

