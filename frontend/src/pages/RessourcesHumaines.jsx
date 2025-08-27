import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  X,
  Mail,
  Calendar,
  Briefcase,
  User,
  CheckCircle,
  Info
} from 'lucide-react';

// Composant banner pour RH (dégradé orange)
const RhBanner = ({ description, children }) => {
  const rhStyle = {
    borderRadius: '16px',
    padding: '20px 24px',
    background: 'linear-gradient(135deg, #FF6B35, #F7931E)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
    marginBottom: '24px',
    position: 'relative',
    overflow: 'hidden'
  };

  return (
    <div className="module-banner rh-banner" style={rhStyle}>
      <div className="module-icon" style={{ fontSize: '1.8rem' }}>👥</div>
      <div>
        <div className="module-title" style={{ fontWeight: 700, fontSize: '1.5rem' }}>Module Ressources Humaines</div>
        {description && (
          <div className="module-description" style={{ opacity: 0.9, fontSize: '0.95rem', marginTop: '4px' }}>{description}</div>
        )}
      </div>
      {children && (
        <div className="ml-auto">
          {children}
        </div>
      )}
    </div>
  );
};

const RessourcesHumaines = () => {
  console.log('🚀 NOUVEAU Composant RessourcesHumaines rendu !');
  
  // États pour la gestion des onglets
  const [activeTab, setActiveTab] = useState('employes');
  
  // États pour la gestion des données
  const [searchTerm, setSearchTerm] = useState('');
  
  // États pour les modals
  const [showEmployeModal, setShowEmployeModal] = useState(false);
  const [editingEmploye, setEditingEmploye] = useState(null);
  
  // États pour la création/modification d'employé
  const [newEmploye, setNewEmploye] = useState({
    matricule: '',
    nom: '',
    prenom: '',
    dateNaissance: '',
    poste: '',
    email: '',
    telephone: '',
    adresse: '',
    dateEmbauche: '',
    statut: 'actif',
    salaire: '',
    commentaires: ''
  });
  const [employeErrors, setEmployeErrors] = useState({});
  
  // Liste des employés
  const [employes, setEmployes] = useState([
    {
      id: 1,
      matricule: 'EMP001',
      nom: 'Dupont',
      prenom: 'Jean',
      dateNaissance: '1985-03-15',
      poste: 'Responsable RH',
      email: 'jean.dupont@gestalis.com',
      telephone: '0594 12 34 56',
      adresse: '123 Rue de la Paix, 97300 Cayenne',
      dateEmbauche: '2020-01-15',
      statut: 'actif',
      salaire: '3500',
      commentaires: 'Responsable du département RH'
    },
    {
      id: 2,
      matricule: 'EMP002',
      nom: 'Martin',
      prenom: 'Marie',
      dateNaissance: '1990-07-22',
      poste: 'Comptable',
      email: 'marie.martin@gestalis.com',
      telephone: '0594 12 34 57',
      adresse: '456 Avenue des Fleurs, 97300 Cayenne',
      dateEmbauche: '2021-03-01',
      statut: 'actif',
      salaire: '2800',
      commentaires: 'Gestion de la comptabilité générale'
    }
  ]);

  // Statuts disponibles
  const statuts = [
    { value: 'actif', label: 'Actif', color: 'bg-green-100 text-green-800' },
    { value: 'inactif', label: 'Inactif', color: 'bg-red-100 text-red-800' },
    { value: 'congé', label: 'En congé', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'formation', label: 'En formation', color: 'bg-blue-100 text-blue-800' }
  ];

  // Initialisation
  useEffect(() => {
    console.log('🔄 useEffect d\'initialisation exécuté');
    
    // Vérifier si on vient du bon de commande pour créer un employé
    const urlParams = new URLSearchParams(window.location.search);
    const createFlag = urlParams.get('create');
    const searchTerm = urlParams.get('searchTerm');
    
    if (createFlag === 'true' && searchTerm) {
      console.log('🎯 Ouverture automatique du modal depuis le bon de commande');
      console.log('🔍 Terme de recherche:', searchTerm);
      
      // Pré-remplir le formulaire avec le terme de recherche
      setNewEmploye(prev => ({
        ...prev,
        nom: searchTerm.split(' ')[0] || '',
        prenom: searchTerm.split(' ')[1] || '',
        matricule: 'EMP' + String(Date.now()).slice(-3)
      }));
      
      // Ouvrir automatiquement le modal
      setShowEmployeModal(true);
      
      // Nettoyer l'URL
      window.history.replaceState({}, document.title, '/rh?tab=employes');
    }
    
    const employesLocal = localStorage.getItem('gestalis-employes');
    if (employesLocal) {
      try {
        const employesParsed = JSON.parse(employesLocal);
        setEmployes(employesParsed);
        console.log('✅ Employés chargés depuis localStorage:', employesParsed);
      } catch (error) {
        console.error('Erreur lors du parsing localStorage:', error);
      }
    } else {
      localStorage.setItem('gestalis-employes', JSON.stringify(employes));
      console.log('💾 Employés par défaut sauvegardés dans localStorage');
    }
  }, []);

  // Sauvegarder dans localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('gestalis-employes', JSON.stringify(employes));
  }, [employes]);

  // Validation du formulaire
  const validateEmploye = () => {
    const errors = {};
    if (!newEmploye.matricule) errors.matricule = 'Le matricule est obligatoire';
    if (!newEmploye.nom) errors.nom = 'Le nom est obligatoire';
    if (!newEmploye.prenom) errors.prenom = 'Le prénom est obligatoire';
    if (!newEmploye.poste) errors.poste = 'Le poste est obligatoire';
    if (!newEmploye.email) errors.email = 'L\'email est obligatoire';
    if (!newEmploye.dateEmbauche) errors.dateEmbauche = 'La date d\'embauche est obligatoire';

    // Vérification des doublons (insensible à la casse)
    const isDuplicate = employes.some(
      (emp) => emp.matricule.toLowerCase() === newEmploye.matricule.toLowerCase() && emp.id !== editingEmploye?.id
    );
    if (isDuplicate) {
      errors.matricule = 'Ce matricule existe déjà';
    }

    return errors;
  };

  // Créer ou modifier un employé
  const handleSaveEmploye = () => {
    console.log('🚀 Tentative de sauvegarde de l\'employé...', newEmploye);
    
    const errors = validateEmploye();
    if (Object.keys(errors).length > 0) {
      console.log('❌ Erreurs de validation:', errors);
      setEmployeErrors(errors);
      alert(`❌ Erreur de validation :\n${Object.values(errors).join('\n')}`);
      return;
    }

    if (editingEmploye) {
      // Modification
      const employeModifie = {
        ...editingEmploye,
        ...newEmploye,
        dateModification: new Date().toISOString()
      };
      
      setEmployes(prev => prev.map(emp => 
        emp.id === editingEmploye.id ? employeModifie : emp
      ));
      
      console.log('✅ Employé modifié avec succès:', employeModifie);
      alert(`✅ Employé "${employeModifie.nom} ${employeModifie.prenom}" modifié avec succès !`);
    } else {
      // Création
      const nouvelEmploye = {
        ...newEmploye,
        id: Date.now(),
        dateCreation: new Date().toISOString()
      };
      
      setEmployes(prev => [nouvelEmploye, ...prev]);
      
      console.log('✅ Employé créé avec succès:', nouvelEmploye);
      alert(`✅ Employé "${nouvelEmploye.nom} ${nouvelEmploye.prenom}" créé avec succès !`);
    }

    resetEmployeForm();
  };

  // Réinitialiser le formulaire
  const resetEmployeForm = () => {
    setNewEmploye({
      matricule: '',
      nom: '',
      prenom: '',
      dateNaissance: '',
      poste: '',
      email: '',
      telephone: '',
      adresse: '',
      dateEmbauche: '',
      statut: 'actif',
      salaire: '',
      commentaires: ''
    });
    setEmployeErrors({});
    setEditingEmploye(null);
    setShowEmployeModal(false);
  };

  // Modifier un employé
  const handleEditEmploye = (employe) => {
    setEditingEmploye(employe);
    setNewEmploye({
      matricule: employe.matricule,
      nom: employe.nom,
      prenom: employe.prenom,
      dateNaissance: employe.dateNaissance,
      poste: employe.poste,
      email: employe.email,
      telephone: employe.telephone,
      adresse: employe.adresse,
      dateEmbauche: employe.dateEmbauche,
      statut: employe.statut,
      salaire: employe.salaire,
      commentaires: employe.commentaires
    });
    setShowEmployeModal(true);
  };

  // Supprimer un employé
  const handleDeleteEmploye = (employe) => {
    if (confirm(`🗑️ Êtes-vous sûr de vouloir supprimer l'employé "${employe.nom} ${employe.prenom}" (${employe.matricule}) ?`)) {
      setEmployes(prev => prev.filter(emp => emp.id !== employe.id));
      alert(`✅ Employé "${employe.nom} ${employe.prenom}" supprimé avec succès !`);
    }
  };

  // Voir les détails d'un employé
  const handleViewEmploye = (employe) => {
    alert(`👤 Détails de l'employé :\n\n` +
          `Matricule: ${employe.matricule}\n` +
          `Nom: ${employe.nom} ${employe.prenom}\n` +
          `Poste: ${employe.poste}\n` +
          `Email: ${employe.email}\n` +
          `Téléphone: ${employe.telephone}\n` +
          `Date d'embauche: ${new Date(employe.dateEmbauche).toLocaleDateString('fr-FR')}\n` +
          `Statut: ${employe.statut}\n` +
          `Salaire: ${employe.salaire}€\n` +
          `Commentaires: ${employe.commentaires || 'Aucun'}`);
  };

  // Filtrer les employés
  const filteredEmployes = employes.filter(employe => {
    const matchesSearch = 
      employe.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employe.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employe.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employe.poste.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  console.log('🎯 Rendu du composant avec:', { activeTab, employes: employes.length, filteredEmployes: filteredEmployes.length });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* RhBanner STICKY */}
      <div className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <RhBanner description="Gestion du personnel et des ressources humaines">
              <button
                onClick={() => setShowEmployeModal(true)}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Nouvel Employé
              </button>
            </RhBanner>
          </div>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="sticky top-[120px] z-20 bg-white/95 backdrop-blur-sm border-b border-gray-200 pb-4">
        <div className="max-w-7xl mx-auto px-6 pt-4">
          <nav className="flex space-x-1 bg-[#FF6B35] p-1 rounded-2xl shadow-sm border border-gray-200">
            {[
              { id: 'employes', label: 'Employés', icon: Users },
              { id: 'formations', label: 'Formations', icon: Briefcase },
              { id: 'paie', label: 'Paie', icon: CheckCircle },
              { id: 'conges', label: 'Congés', icon: Calendar }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                    : 'text-white hover:text-orange-100 hover:bg-white/20'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-6 py-8 pt-4">
        {/* Section Employés */}
        {activeTab === 'employes' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="text-center flex-1">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">Gestion des Employés</h3>
                <p className="text-gray-500">Effectif total : {employes.length} employé(s)</p>
              </div>
              
              <div className="text-center ml-8">
                <button
                  onClick={() => setShowEmployeModal(true)}
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <UserPlus className="h-5 w-5" />
                  Nouvel Employé
                </button>
                <p className="text-sm text-gray-500 mt-3">Ajouter un nouvel employé</p>
              </div>
            </div>
            
            {/* Recherche */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un employé..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>
              
              <div className="text-sm text-gray-500">
                {filteredEmployes.length} employé(s) trouvé(s)
              </div>
            </div>
            
            {/* Tableau des employés */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Matricule</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Nom & Prénom</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Poste</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Contact</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Statut</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployes.map((employe) => (
                    <tr key={employe.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <span className="font-mono text-sm bg-orange-100 text-orange-800 px-2 py-1 rounded">
                          {employe.matricule}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{employe.nom} {employe.prenom}</div>
                          <div className="text-sm text-gray-500">
                            {employe.dateNaissance && new Date(employe.dateNaissance).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-600">{employe.poste}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">
                          <div className="text-gray-900">{employe.email}</div>
                          <div className="text-gray-500">{employe.telephone}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {statuts.find(s => s.value === employe.statut) && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            statuts.find(s => s.value === employe.statut)?.color
                          }`}>
                            {statuts.find(s => s.value === employe.statut)?.label}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleViewEmploye(employe)}
                            className="p-1 text-gray-400 hover:text-orange-500 transition-colors"
                            title="Voir les détails"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleEditEmploye(employe)}
                            className="p-1 text-gray-400 hover:text-orange-600 transition-colors"
                            title="Modifier l'employé"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteEmploye(employe)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="Supprimer l'employé"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredEmployes.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-8 w-8 mx-auto mb-2" />
                <p>Aucun employé trouvé</p>
              </div>
            )}
          </div>
        )}

        {/* Autres onglets */}
        {activeTab === 'formations' && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Formations</h3>
            <p className="text-gray-500">Gestion des formations et compétences</p>
          </div>
        )}

        {activeTab === 'paie' && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Paie</h3>
            <p className="text-gray-500">Gestion des salaires et avantages</p>
          </div>
        )}

        {activeTab === 'conges' && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Congés</h3>
            <p className="text-gray-500">Gestion des congés et absences</p>
          </div>
        )}
      </div>

      {/* Modal Employé */}
      {showEmployeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Header du modal */}
            <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 text-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">
                  {editingEmploye ? 'Modifier l\'employé' : 'Nouvel Employé'}
                </h3>
                <button
                  onClick={resetEmployeForm}
                  className="text-white/80 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            {/* Contenu du modal */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Informations personnelles */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Informations personnelles
                  </h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Matricule <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="ex: EMP001"
                      value={newEmploye.matricule}
                      onChange={(e) => setNewEmploye({...newEmploye, matricule: e.target.value.toUpperCase()})}
                      className={`w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none ${employeErrors.matricule ? 'border-red-500' : ''}`}
                    />
                    {employeErrors.matricule && (
                      <p className="text-red-500 text-sm mt-1">{employeErrors.matricule}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Nom de famille"
                        value={newEmploye.nom}
                        onChange={(e) => setNewEmploye({...newEmploye, nom: e.target.value})}
                        className={`w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none ${employeErrors.nom ? 'border-red-500' : ''}`}
                      />
                      {employeErrors.nom && (
                        <p className="text-red-500 text-sm mt-1">{employeErrors.nom}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prénom <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Prénom"
                        value={newEmploye.prenom}
                        onChange={(e) => setNewEmploye({...newEmploye, prenom: e.target.value})}
                        className={`w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none ${employeErrors.prenom ? 'border-red-500' : ''}`}
                      />
                      {employeErrors.prenom && (
                        <p className="text-red-500 text-sm mt-1">{employeErrors.prenom}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date de naissance</label>
                    <input
                      type="date"
                      value={newEmploye.dateNaissance}
                      onChange={(e) => setNewEmploye({...newEmploye, dateNaissance: e.target.value})}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Informations professionnelles */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Informations professionnelles
                  </h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Poste <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="ex: Comptable, Acheteur, Responsable..."
                      value={newEmploye.poste}
                      onChange={(e) => setNewEmploye({...newEmploye, poste: e.target.value})}
                      className={`w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none ${employeErrors.poste ? 'border-red-500' : ''}`}
                    />
                    {employeErrors.poste && (
                      <p className="text-red-500 text-sm mt-1">{employeErrors.poste}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date d'embauche <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={newEmploye.dateEmbauche}
                      onChange={(e) => setNewEmploye({...newEmploye, dateEmbauche: e.target.value})}
                      className={`w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none ${employeErrors.dateEmbauche ? 'border-red-500' : ''}`}
                    />
                    {employeErrors.dateEmbauche && (
                      <p className="text-red-500 text-sm mt-1">{employeErrors.dateEmbauche}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                    <select
                      value={newEmploye.statut}
                      onChange={(e) => setNewEmploye({...newEmploye, statut: e.target.value})}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none"
                    >
                      {statuts.map((statut) => (
                        <option key={statut.value} value={statut.value}>{statut.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Informations de contact */}
              <div className="mt-6 space-y-4">
                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Informations de contact
                </h4>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="ex: nom@gestalis.com"
                      value={newEmploye.email}
                      onChange={(e) => setNewEmploye({...newEmploye, email: e.target.value})}
                      className={`w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none ${employeErrors.email ? 'border-red-500' : ''}`}
                    />
                    {employeErrors.email && (
                      <p className="text-red-500 text-sm mt-1">{employeErrors.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                    <input
                      type="tel"
                      placeholder="ex: 0594 12 34 56"
                      value={newEmploye.telephone}
                      onChange={(e) => setNewEmploye({...newEmploye, telephone: e.target.value})}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                  <input
                    type="text"
                    placeholder="Adresse complète"
                    value={newEmploye.adresse}
                    onChange={(e) => setNewEmploye({...newEmploye, adresse: e.target.value})}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Informations complémentaires */}
              <div className="mt-6 space-y-4">
                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Informations complémentaires
                </h4>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Salaire (€)</label>
                    <input
                      type="number"
                      placeholder="ex: 3000"
                      value={newEmploye.salaire}
                      onChange={(e) => setNewEmploye({...newEmploye, salaire: e.target.value})}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Commentaires</label>
                    <textarea
                      placeholder="Informations supplémentaires..."
                      value={newEmploye.commentaires}
                      onChange={(e) => setNewEmploye({...newEmploye, commentaires: e.target.value})}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={resetEmployeForm}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveEmploye}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-lg transition-all duration-200 font-medium"
                >
                  <UserPlus className="h-4 w-4 inline mr-2" />
                  {editingEmploye ? 'Modifier l\'employé' : 'Créer l\'employé'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RessourcesHumaines;
