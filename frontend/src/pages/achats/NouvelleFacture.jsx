import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Building2, 
  Receipt, 
  Calendar, 
  DollarSign, 
  FileText,
  Trash2,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Package,
  Users,
  Wrench,
  Truck,
  Calculator
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NouvelleFacture = () => {
  const navigate = useNavigate();
  
  // États principaux
  const [activeTab, setActiveTab] = useState('coordonnees');
  const [facture, setFacture] = useState({
    type: 'FACTURE_STANDARD',
    numero: '',
    dateFacture: new Date().toISOString().split('T')[0],
    dateEcheance: '',
    fournisseur: null,
    chantier: null,
    cessionCreance: false,
    organismeCession: '',
    tauxCession: 0,
    lignes: [],
    totalHT: 0,
    totalTVA: 0,
    totalTTC: 0,
    netAPayer: 0,
    notes: ''
  });

  // États pour la gestion des données
  const [fournisseurs, setFournisseurs] = useState([]);
  const [chantiers, setChantiers] = useState([]);
  const [produits, setProduits] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFournisseurResults, setShowFournisseurResults] = useState(false);
  const [showChantierResults, setShowChantierResults] = useState(false);
  const [showProduitResults, setShowProduitResults] = useState(false);

  // États pour les modals
  const [showCreateProduitModal, setShowCreateProduitModal] = useState(false);
  const [newProduit, setNewProduit] = useState({
    designation: '',
    categorie: 'MATERIAU',
    unite: '',
    prixUnitaire: 0,
    codeFournisseur: ''
  });

  // Types de factures
  const typesFactures = [
    { id: 'FACTURE_STANDARD', label: 'Facture Standard', icon: Receipt, color: 'blue' },
    { id: 'FACTURE_SITUATION', label: 'Facture de Situation', icon: TrendingUp, color: 'green' },
    { id: 'FACTURE_ACOMPTE', label: 'Facture d\'Acompte', icon: Clock, color: 'yellow' },
    { id: 'FACTURE_REVISION', label: 'Facture de Révision', icon: AlertCircle, color: 'orange' },
    { id: 'AVOIR', label: 'Avoir', icon: X, color: 'red' }
  ];

  // Catégories de produits
  const categoriesProduits = [
    { id: 'MATERIAU', label: 'Matériaux', icon: Package, color: 'blue' },
    { id: 'MAIN_OEUVRE', label: 'Main d\'œuvre', icon: Users, color: 'green' },
    { id: 'SOUS_TRAITANCE', label: 'Sous-traitance', icon: Wrench, color: 'purple' },
    { id: 'SERVICE', label: 'Services', icon: Truck, color: 'orange' }
  ];

  // Données d'exemple (à remplacer par des appels API)
  useEffect(() => {
    // Simulation de chargement des données
    setFournisseurs([
      { id: 'FOUR001', raisonSociale: 'Béton Express', siret: '12345678901234', codeFournisseur: 'BE001' },
      { id: 'FOUR002', raisonSociale: 'Acier Pro', siret: '23456789012345', codeFournisseur: 'AP002' },
      { id: 'FOUR003', raisonSociale: 'Matériaux Plus', siret: '34567890123456', codeFournisseur: 'MP003' }
    ]);

    setChantiers([
      { id: 'CHANT001', nom: 'Résidence Les Jardins', adresse: '123 Rue de la Paix, Paris' },
      { id: 'CHANT002', nom: 'Immeuble de bureaux', adresse: '456 Avenue des Champs, Lyon' }
    ]);

    setProduits([
      { id: 'PROD001', designation: 'Béton C25/30', categorie: 'MATERIAU', unite: 'm³', prixUnitaire: 120.00, fournisseur: 'Béton Express' },
      { id: 'PROD002', designation: 'Acier HA500', categorie: 'MATERIAU', unite: 'kg', prixUnitaire: 2.50, fournisseur: 'Acier Pro' }
    ]);
  }, []);

  // Calculs automatiques
  useEffect(() => {
    const totalHT = facture.lignes.reduce((sum, ligne) => sum + ligne.montantHT, 0);
    const totalTVA = totalHT * 0.20; // TVA 20%
    const totalTTC = totalHT + totalTVA;
    
    let netAPayer = totalTTC;
    if (facture.cessionCreance) {
      const coutCession = totalTTC * (facture.tauxCession / 100);
      netAPayer = totalTTC - coutCession;
    }

    setFacture(prev => ({
      ...prev,
      totalHT,
      totalTVA,
      totalTTC,
      netAPayer
    }));
  }, [facture.lignes, facture.cessionCreance, facture.tauxCession]);

  // Gestion des lignes de facture
  const addLigne = () => {
    const newLigne = {
      id: Date.now(),
      produit: null,
      designation: '',
      quantite: 1,
      unite: '',
      prixUnitaire: 0,
      montantHT: 0,
      categorie: 'MATERIAU',
      chantierAffectation: facture.chantier?.id || null
    };
    setFacture(prev => ({ ...prev, lignes: [...prev.lignes, newLigne] }));
  };

  const updateLigne = (id, field, value) => {
    setFacture(prev => ({
      ...prev,
      lignes: prev.lignes.map(ligne => {
        if (ligne.id === id) {
          const updatedLigne = { ...ligne, [field]: value };
          // Calcul automatique du montant HT
          if (field === 'quantite' || field === 'prixUnitaire') {
            updatedLigne.montantHT = updatedLigne.quantite * updatedLigne.prixUnitaire;
          }
          return updatedLigne;
        }
        return ligne;
      })
    }));
  };

  const removeLigne = (id) => {
    setFacture(prev => ({
      ...prev,
      lignes: prev.lignes.filter(ligne => ligne.id !== id)
    }));
  };

  // Gestion des produits
  const handleProduitSelect = (produit, ligneId) => {
    updateLigne(ligneId, 'produit', produit);
    updateLigne(ligneId, 'designation', produit.designation);
    updateLigne(ligneId, 'unite', produit.unite);
    updateLigne(ligneId, 'prixUnitaire', produit.prixUnitaire);
    updateLigne(ligneId, 'categorie', produit.categorie);
    updateLigne(ligneId, 'montantHT', produit.prixUnitaire);
    setShowProduitResults(false);
  };

  const createProduit = () => {
    if (!newProduit.designation || !newProduit.unite || !newProduit.prixUnitaire) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const produit = {
      id: `PROD${Date.now()}`,
      ...newProduit,
      fournisseur: facture.fournisseur?.raisonSociale || 'Nouveau'
    };

    setProduits(prev => [...prev, produit]);
    setNewProduit({ designation: '', categorie: 'MATERIAU', unite: '', prixUnitaire: 0, codeFournisseur: '' });
    setShowCreateProduitModal(false);
    alert('Produit créé avec succès dans la bibliothèque !');
  };

  // Sauvegarde de la facture
  const saveFacture = () => {
    if (!facture.fournisseur) {
      alert('Veuillez sélectionner un fournisseur');
      return;
    }
    if (facture.lignes.length === 0) {
      alert('Veuillez ajouter au moins une ligne');
      return;
    }

    // Ici on sauvegarderait en base de données
    alert('Facture sauvegardée avec succès !');
    navigate('/achats/factures');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* En-tête */}
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Nouvelle Facture</h1>
              <p className="text-gray-600 mt-2">Création d'une facture fournisseur</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/achats/factures')}
                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={saveFacture}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white rounded-xl transition-all duration-200 font-medium flex items-center gap-2"
              >
                <Save className="h-5 w-5" />
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Navigation par onglets */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-1 p-4">
                {[
                  { id: 'coordonnees', label: 'Coordonnées', icon: FileText },
                  { id: 'lignes', label: 'Lignes de facture', icon: Receipt },
                  { id: 'calculs', label: 'Calculs', icon: Calculator },
                  { id: 'cession', label: 'Cession de créance', icon: TrendingUp }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Contenu des onglets */}
            <div className="p-6">
              {/* Onglet Coordonnées */}
              {activeTab === 'coordonnees' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">Informations générales</h3>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Type de facture *</label>
                      <div className="grid grid-cols-1 gap-3">
                        {typesFactures.map((type) => (
                          <label key={type.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input
                              type="radio"
                              name="typeFacture"
                              value={type.id}
                              checked={facture.type === type.id}
                              onChange={(e) => setFacture(prev => ({ ...prev, type: e.target.value }))}
                              className="text-blue-600"
                            />
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${type.color}-100`}>
                              <type.icon className={`h-4 w-4 text-${type.color}-600`} />
                            </div>
                            <span className="font-medium">{type.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de facture</label>
                        <input
                          type="text"
                          value={facture.numero}
                          onChange={(e) => setFacture(prev => ({ ...prev, numero: e.target.value }))}
                          placeholder="Numéro fournisseur"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Date facture *</label>
                          <input
                            type="date"
                            value={facture.dateFacture}
                            onChange={(e) => setFacture(prev => ({ ...prev, dateFacture: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Date échéance</label>
                          <input
                            type="date"
                            value={facture.dateEcheance}
                            onChange={(e) => setFacture(prev => ({ ...prev, dateEcheance: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Fournisseur *</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Rechercher un fournisseur..."
                          value={searchTerm}
                          onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setShowFournisseurResults(true);
                          }}
                          onFocus={() => setShowFournisseurResults(true)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        
                        {showFournisseurResults && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {fournisseurs
                              .filter(f => f.raisonSociale.toLowerCase().includes(searchTerm.toLowerCase()))
                              .map((fournisseur) => (
                                <div
                                  key={fournisseur.id}
                                  onClick={() => {
                                    setFacture(prev => ({ ...prev, fournisseur }));
                                    setSearchTerm(fournisseur.raisonSociale);
                                    setShowFournisseurResults(false);
                                  }}
                                  className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                >
                                  <div className="font-medium text-gray-900">{fournisseur.raisonSociale}</div>
                                  <div className="text-sm text-gray-600">{fournisseur.codeFournisseur} • {fournisseur.siret}</div>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Chantier</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Sélectionner un chantier..."
                          value={facture.chantier?.nom || ''}
                          onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setShowChantierResults(true);
                          }}
                          onFocus={() => setShowChantierResults(true)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        
                        {showChantierResults && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {chantiers
                              .filter(c => c.nom.toLowerCase().includes(searchTerm.toLowerCase()))
                              .map((chantier) => (
                                <div
                                  key={chantier.id}
                                  onClick={() => {
                                    setFacture(prev => ({ ...prev, chantier }));
                                    setShowChantierResults(false);
                                  }}
                                  className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                >
                                  <div className="font-medium text-gray-900">{chantier.nom}</div>
                                  <div className="text-sm text-gray-600">{chantier.adresse}</div>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <textarea
                      value={facture.notes}
                      onChange={(e) => setFacture(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Notes additionnelles..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Onglet Lignes de facture */}
              {activeTab === 'lignes' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">Lignes de facture</h3>
                    <button
                      onClick={addLigne}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Ajouter une ligne
                    </button>
                  </div>

                  {facture.lignes.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Aucune ligne de facture</p>
                      <p className="text-sm text-gray-400">Commencez par ajouter une ligne</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {facture.lignes.map((ligne, index) => (
                        <div key={ligne.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="grid grid-cols-12 gap-4 items-center">
                            {/* Catégorie */}
                            <div className="col-span-2">
                              <select
                                value={ligne.categorie}
                                onChange={(e) => updateLigne(ligne.id, 'categorie', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              >
                                {categoriesProduits.map(cat => (
                                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                                ))}
                              </select>
                            </div>

                            {/* Désignation */}
                            <div className="col-span-4">
                              <div className="relative">
                                <input
                                  type="text"
                                  placeholder="Désignation du produit/service..."
                                  value={ligne.designation}
                                  onChange={(e) => updateLigne(ligne.id, 'designation', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <button
                                  onClick={() => setShowProduitResults(true)}
                                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-700"
                                >
                                  <Search className="h-4 w-4" />
                                </button>
                              </div>
                            </div>

                            {/* Quantité */}
                            <div className="col-span-1">
                              <input
                                type="number"
                                placeholder="Qté"
                                value={ligne.quantite}
                                onChange={(e) => updateLigne(ligne.id, 'quantite', parseFloat(e.target.value) || 0)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>

                            {/* Unité */}
                            <div className="col-span-1">
                              <input
                                type="text"
                                placeholder="Unité"
                                value={ligne.unite}
                                onChange={(e) => updateLigne(ligne.id, 'unite', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>

                            {/* Prix unitaire */}
                            <div className="col-span-2">
                              <input
                                type="number"
                                placeholder="Prix HT"
                                value={ligne.prixUnitaire}
                                onChange={(e) => updateLigne(ligne.id, 'prixUnitaire', parseFloat(e.target.value) || 0)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>

                            {/* Montant HT */}
                            <div className="col-span-1">
                              <div className="px-3 py-2 bg-gray-50 rounded-lg text-right font-medium">
                                {ligne.montantHT.toFixed(2)} €
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="col-span-1">
                              <button
                                onClick={() => removeLigne(ligne.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Onglet Calculs */}
              {activeTab === 'calculs' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">Calculs et totaux</h3>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium text-gray-900">Détail des calculs</h4>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b border-gray-200">
                          <span className="text-gray-600">Total HT</span>
                          <span className="font-medium">{facture.totalHT.toFixed(2)} €</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-200">
                          <span className="text-gray-600">TVA (20%)</span>
                          <span className="font-medium">{facture.totalTVA.toFixed(2)} €</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-200">
                          <span className="text-gray-600">Total TTC</span>
                          <span className="font-medium">{facture.totalTTC.toFixed(2)} €</span>
                        </div>
                        {facture.cessionCreance && (
                          <>
                            <div className="flex justify-between py-2 border-b border-gray-200">
                              <span className="text-gray-600">Coût cession ({facture.tauxCession}%)</span>
                              <span className="font-medium text-red-600">
                                -{(facture.totalTTC * facture.tauxCession / 100).toFixed(2)} €
                              </span>
                            </div>
                            <div className="flex justify-between py-2 bg-blue-50 p-3 rounded-lg">
                              <span className="text-blue-900 font-medium">Net à payer</span>
                              <span className="text-blue-900 font-bold">{facture.netAPayer.toFixed(2)} €</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-lg font-medium text-gray-900">Résumé</h4>
                      
                      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">Nombre de lignes</span>
                          <span className="ml-auto font-medium">{facture.lignes.length}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">Fournisseur</span>
                          <span className="ml-auto font-medium">{facture.fournisseur?.raisonSociale || 'Non sélectionné'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">Chantier</span>
                          <span className="ml-auto font-medium">{facture.chantier?.nom || 'Non affecté'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">Type</span>
                          <span className="ml-auto font-medium">
                            {typesFactures.find(t => t.id === facture.type)?.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Onglet Cession de créance */}
              {activeTab === 'cession' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">Cession de créance</h3>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900">Qu'est-ce que la cession de créance ?</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          La cession de créance permet de transférer le droit de recouvrement d'une facture à un organisme financier. 
                          Le client paie directement le fournisseur, réduisant le besoin en trésorerie de l'entreprise.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={facture.cessionCreance}
                        onChange={(e) => setFacture(prev => ({ ...prev, cessionCreance: e.target.checked }))}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="font-medium text-gray-900">Cette facture est cédée</span>
                    </label>

                    {facture.cessionCreance && (
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Organisme de cession</label>
                          <input
                            type="text"
                            value={facture.organismeCession}
                            onChange={(e) => setFacture(prev => ({ ...prev, organismeCession: e.target.value }))}
                            placeholder="Banque, organisme financier..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Taux de cession (%)</label>
                          <input
                            type="number"
                            value={facture.tauxCession}
                            onChange={(e) => setFacture(prev => ({ ...prev, tauxCession: parseFloat(e.target.value) || 0 }))}
                            placeholder="2.5"
                            step="0.1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {facture.cessionCreance && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <h4 className="font-medium text-green-900">Impact de la cession</h4>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-green-700">Montant facturé</span>
                          <div className="font-medium text-green-900">{facture.totalTTC.toFixed(2)} €</div>
                        </div>
                        <div>
                          <span className="text-green-700">Coût cession</span>
                          <div className="font-medium text-green-900">{(facture.totalTTC * facture.tauxCession / 100).toFixed(2)} €</div>
                        </div>
                        <div>
                          <span className="text-green-700">Net à payer</span>
                          <div className="font-bold text-green-900">{facture.netAPayer.toFixed(2)} €</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de création de produit */}
      {showCreateProduitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">Créer un nouveau produit</h3>
                <button
                  onClick={() => setShowCreateProduitModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Désignation *</label>
                <input
                  type="text"
                  value={newProduit.designation}
                  onChange={(e) => setNewProduit(prev => ({ ...prev, designation: e.target.value }))}
                  placeholder="Nom du produit/service"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie *</label>
                  <select
                    value={newProduit.categorie}
                    onChange={(e) => setNewProduit(prev => ({ ...prev, categorie: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {categoriesProduits.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unité *</label>
                  <input
                    type="text"
                    value={newProduit.unite}
                    onChange={(e) => setNewProduit(prev => ({ ...prev, unite: e.target.value }))}
                    placeholder="m³, kg, h, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prix unitaire HT *</label>
                  <input
                    type="number"
                    value={newProduit.prixUnitaire}
                    onChange={(e) => setNewProduit(prev => ({ ...prev, prixUnitaire: parseFloat(e.target.value) || 0 }))}
                    placeholder="0.00"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Code fournisseur</label>
                  <input
                    type="text"
                    value={newProduit.codeFournisseur}
                    onChange={(e) => setNewProduit(prev => ({ ...prev, codeFournisseur: e.target.value }))}
                    placeholder="Code interne fournisseur"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateProduitModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={createProduit}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                Créer le produit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de sélection de produit */}
      {showProduitResults && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">Sélectionner un produit</h3>
                <button
                  onClick={() => setShowProduitResults(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un produit..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {produits.map((produit) => (
                  <div
                    key={produit.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${categoriesProduits.find(c => c.id === produit.categorie)?.color}-100`}>
                        {React.createElement(categoriesProduits.find(c => c.id === produit.categorie)?.icon, { className: `h-4 w-4 text-${categoriesProduits.find(c => c.id === produit.categorie)?.color}-600` })}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{produit.designation}</div>
                        <div className="text-sm text-gray-600">{produit.categorie} • {produit.unite} • {produit.fournisseur}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">{produit.prixUnitaire.toFixed(2)} €</div>
                      <div className="text-sm text-gray-500">{produit.unite}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowProduitResults(false);
                    setShowCreateProduitModal(true);
                  }}
                  className="w-full px-4 py-2 border-2 border-dashed border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Créer un nouveau produit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NouvelleFacture;

