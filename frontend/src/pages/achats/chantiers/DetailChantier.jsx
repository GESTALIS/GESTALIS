import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Building2, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  FileText,
  Clock,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { GestalisCard, GestalisCardContent, GestalisCardHeader, GestalisCardTitle } from '@/components/ui/gestalis-card';
import { GestalisButton } from '@/components/ui/gestalis-button';

const DetailChantier = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chantier, setChantier] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer le chantier depuis localStorage
    const chantiers = JSON.parse(localStorage.getItem('gestalis-chantiers') || '[]');
    const foundChantier = chantiers.find(c => c.id === parseInt(id));
    
    if (foundChantier) {
      setChantier(foundChantier);
    } else {
      // Rediriger si le chantier n'existe pas
      navigate('/chantiers');
    }
    setLoading(false);
  }, [id, navigate]);

  const handleEdit = () => {
    navigate(`/chantiers/${id}/modifier`);
  };

  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce chantier ?')) {
      const chantiers = JSON.parse(localStorage.getItem('gestalis-chantiers') || '[]');
      const updatedChantiers = chantiers.filter(c => c.id !== parseInt(id));
      localStorage.setItem('gestalis-chantiers', JSON.stringify(updatedChantiers));
      navigate('/chantiers');
    }
  };

  const getStatusColor = (statut) => {
    const colors = {
      'en_preparation': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'en_cours': 'bg-blue-100 text-blue-800 border-blue-200',
      'suspendu': 'bg-orange-100 text-orange-800 border-orange-200',
      'termine': 'bg-green-100 text-green-800 border-green-200',
      'annule': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[statut] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusLabel = (statut) => {
    const labels = {
      'en_preparation': 'En préparation',
      'en_cours': 'En cours',
      'suspendu': 'Suspendu',
      'termine': 'Terminé',
      'annule': 'Annulé'
    };
    return labels[statut] || statut;
  };

  const getStatusIcon = (statut) => {
    const icons = {
      'en_preparation': Clock,
      'en_cours': Play,
      'suspendu': Pause,
      'termine': CheckCircle,
      'annule': XCircle
    };
    return icons[statut] || AlertCircle;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!chantier) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Chantier non trouvé</h2>
          <p className="text-gray-600 mb-4">Le chantier que vous recherchez n'existe pas.</p>
          <GestalisButton onClick={() => navigate('/chantiers')}>
            Retour à la liste
          </GestalisButton>
        </div>
      </div>
    );
  }

  const StatusIcon = getStatusIcon(chantier.statut);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête avec navigation */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <GestalisButton 
                variant="outline" 
                onClick={() => navigate('/chantiers')}
                className="border-gray-300"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </GestalisButton>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{chantier.nom}</h1>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 text-sm font-medium rounded-full border bg-gray-100 text-gray-800">
                    {chantier.code}
                  </span>
                  {chantier.numeroExterne && (
                    <span className="px-3 py-1 text-sm font-medium rounded-full border bg-blue-100 text-blue-800">
                      {chantier.numeroExterne}
                    </span>
                  )}
                  <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(chantier.statut)}`}>
                    <StatusIcon className="h-3 w-3 inline mr-1" />
                    {getStatusLabel(chantier.statut)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <GestalisButton 
                variant="outline"
                onClick={handleEdit}
                className="border-green-500 text-green-600 hover:bg-green-50"
              >
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </GestalisButton>
              <GestalisButton 
                variant="danger"
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </GestalisButton>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations de base */}
            <GestalisCard>
              <GestalisCardHeader>
                <GestalisCardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-green-600" />
                  Informations de base
                </GestalisCardTitle>
              </GestalisCardHeader>
              <GestalisCardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Description</label>
                  <p className="text-gray-900">{chantier.description || 'Aucune description'}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Type de chantier</label>
                    <p className="text-gray-900">{chantier.type}</p>
                  </div>
                  {chantier.numeroExterne && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Numéro externe</label>
                      <p className="text-gray-900">{chantier.numeroExterne}</p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Statut</label>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(chantier.statut)}`}>
                      <StatusIcon className="h-3 w-3 inline mr-1" />
                      {getStatusLabel(chantier.statut)}
                    </span>
                  </div>
                </div>
              </GestalisCardContent>
            </GestalisCard>

            {/* Client et Localisation */}
            <GestalisCard>
              <GestalisCardHeader>
                <GestalisCardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Client et Localisation
                </GestalisCardTitle>
              </GestalisCardHeader>
              <GestalisCardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Client</label>
                  <p className="text-gray-900 font-medium">{chantier.clientNom}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Adresse</label>
                    <p className="text-gray-900">{chantier.adresse || 'Non spécifiée'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Ville</label>
                    <p className="text-gray-900">{chantier.ville}</p>
                  </div>
                </div>
                
                {chantier.codePostal && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Code postal</label>
                    <p className="text-gray-900">{chantier.codePostal}</p>
                  </div>
                )}
              </GestalisCardContent>
            </GestalisCard>

            {/* Planning et Durée */}
            <GestalisCard>
              <GestalisCardHeader>
                <GestalisCardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  Planning et Durée
                </GestalisCardTitle>
              </GestalisCardHeader>
              <GestalisCardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Date de début</label>
                    <p className="text-gray-900">
                      {chantier.dateDebut ? new Date(chantier.dateDebut).toLocaleDateString('fr-FR') : 'Non définie'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Date de fin</label>
                    <p className="text-gray-900">
                      {chantier.dateFin ? new Date(chantier.dateFin).toLocaleDateString('fr-FR') : 'Non définie'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Durée estimée</label>
                    <p className="text-gray-900">{chantier.dureeEstimee || 'Non définie'}</p>
                  </div>
                </div>
              </GestalisCardContent>
            </GestalisCard>

            {/* Équipe et Ressources */}
            <GestalisCard>
              <GestalisCardHeader>
                <GestalisCardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-indigo-600" />
                  Équipe et Ressources
                </GestalisCardTitle>
              </GestalisCardHeader>
              <GestalisCardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Chef de chantier</label>
                    <p className="text-gray-900">{chantier.chefChantier || 'Non assigné'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Taille de l'équipe</label>
                    <p className="text-gray-900">{chantier.equipe ? `${chantier.equipe} personne(s)` : 'Non définie'}</p>
                  </div>
                </div>
                
                {chantier.sousTraitants && chantier.sousTraitants.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">Sous-traitants impliqués</label>
                    <div className="space-y-1">
                      {chantier.sousTraitants.map((st, index) => (
                        <div key={index} className="px-3 py-2 bg-gray-50 rounded-lg">
                          <span className="text-gray-900">{st}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </GestalisCardContent>
            </GestalisCard>

            {/* Documents */}
            {chantier.documents && chantier.documents.length > 0 && (
              <GestalisCard>
                <GestalisCardHeader>
                  <GestalisCardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-orange-600" />
                    Documents
                  </GestalisCardTitle>
                </GestalisCardHeader>
                <GestalisCardContent className="space-y-2">
                  {chantier.documents.map((doc, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="flex-1 text-gray-900">{doc.nom}</span>
                      <GestalisButton variant="outline" size="sm">
                        Télécharger
                      </GestalisButton>
                    </div>
                  ))}
                </GestalisCardContent>
              </GestalisCard>
            )}
          </div>

          {/* Colonne latérale */}
          <div className="space-y-6">
            {/* Informations financières */}
            <GestalisCard>
              <GestalisCardHeader>
                <GestalisCardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Informations financières
                </GestalisCardTitle>
              </GestalisCardHeader>
              <GestalisCardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Montant HT</label>
                  <p className="text-2xl font-bold text-green-600">
                    {chantier.montant ? new Intl.NumberFormat('fr-FR', { 
                      style: 'currency', 
                      currency: chantier.devise,
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }).format(chantier.montant) : 'Non défini'}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Devise</label>
                    <p className="text-gray-900">{chantier.devise}</p>
                  </div>
                  
                  {chantier.acompte && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Acompte reçu</label>
                      <p className="text-gray-900">
                        {new Intl.NumberFormat('fr-FR', { 
                          style: 'currency', 
                          currency: chantier.devise,
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0
                        }).format(chantier.acompte)}
                      </p>
                    </div>
                  )}
                  
                  {chantier.montant && chantier.acompte && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Solde restant</label>
                      <p className="text-lg font-semibold text-blue-600">
                        {new Intl.NumberFormat('fr-FR', { 
                          style: 'currency', 
                          currency: chantier.devise,
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0
                        }).format(chantier.montant - chantier.acompte)}
                      </p>
                    </div>
                  )}
                </div>
              </GestalisCardContent>
            </GestalisCard>

            {/* Statistiques rapides */}
            <GestalisCard>
              <GestalisCardHeader>
                <GestalisCardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  Statistiques
                </GestalisCardTitle>
              </GestalisCardHeader>
              <GestalisCardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Progression</span>
                  <span className="text-sm font-medium text-gray-900">
                    {chantier.statut === 'termine' ? '100%' : 
                     chantier.statut === 'en_cours' ? '50%' : 
                     chantier.statut === 'en_preparation' ? '25%' : '0%'}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      chantier.statut === 'termine' ? 'bg-green-600' :
                      chantier.statut === 'en_cours' ? 'bg-blue-600' :
                      chantier.statut === 'en_preparation' ? 'bg-yellow-600' : 'bg-gray-600'
                    }`}
                    style={{
                      width: chantier.statut === 'termine' ? '100%' : 
                             chantier.statut === 'en_cours' ? '50%' : 
                             chantier.statut === 'en_preparation' ? '25%' : '0%'
                    }}
                  ></div>
                </div>
                
                <div className="pt-2 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    Créé le {new Date(chantier.dateCreation).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              </GestalisCardContent>
            </GestalisCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailChantier;
