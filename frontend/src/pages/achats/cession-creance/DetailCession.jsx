import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  FileText, 
  Users, 
  Building2, 
  Calendar, 
  DollarSign, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download
} from 'lucide-react';
import { GestalisCard, GestalisCardContent, GestalisCardHeader, GestalisCardTitle } from '../../../components/ui/GestalisCard';
import { GestalisButton } from '../../../components/ui/gestalis-button';

const DetailCession = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cession, setCession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer la cession depuis localStorage
    const cessions = JSON.parse(localStorage.getItem('gestalis-cessions') || '[]');
    const foundCession = cessions.find(c => c.id === parseInt(id));
    
    if (foundCession) {
      setCession(foundCession);
    } else {
      // Rediriger si la cession n'existe pas
      navigate('/achats/cession-creance');
    }
    setLoading(false);
  }, [id, navigate]);

  const handleEdit = () => {
    navigate(`/achats/cession-creance/${id}/modifier`);
  };

  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette cession ?')) {
      const cessions = JSON.parse(localStorage.getItem('gestalis-cessions') || '[]');
      const updatedCessions = cessions.filter(c => c.id !== parseInt(id));
      localStorage.setItem('gestalis-cessions', JSON.stringify(updatedCessions));
      navigate('/achats/cession-creance');
    }
  };

  const getStatusColor = (statut) => {
    const colors = {
      'EN_ATTENTE': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'EN_COURS': 'bg-blue-100 text-blue-800 border-blue-200',
      'TERMINEE': 'bg-green-100 text-green-800 border-green-200',
      'SUSPENDUE': 'bg-orange-100 text-orange-800 border-orange-200',
      'ANNULEE': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[statut] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusLabel = (statut) => {
    const labels = {
      'EN_ATTENTE': 'En attente',
      'EN_COURS': 'En cours',
      'TERMINEE': 'Terminée',
      'SUSPENDUE': 'Suspendue',
      'ANNULEE': 'Annulée'
    };
    return labels[statut] || statut;
  };

  const getStatusIcon = (statut) => {
    const icons = {
      'EN_ATTENTE': AlertCircle,
      'EN_COURS': Clock,
      'TERMINEE': CheckCircle,
      'SUSPENDUE': Clock,
      'ANNULEE': XCircle
    };
    return icons[statut] || AlertCircle;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!cession) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Cession non trouvée</h2>
          <p className="text-gray-600 mb-4">La cession que vous recherchez n'existe pas.</p>
          <GestalisButton onClick={() => navigate('/achats/cession-creance')}>
            Retour à la liste
          </GestalisButton>
        </div>
      </div>
    );
  }

  const StatusIcon = getStatusIcon(cession.statut);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête avec navigation */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <GestalisButton 
                variant="outline" 
                onClick={() => navigate('/achats/cession-creance')}
                className="border-gray-300"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </GestalisButton>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{cession.reference}</h1>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(cession.statut)}`}>
                    <StatusIcon className="h-3 w-3 inline mr-1" />
                    {getStatusLabel(cession.statut)}
                  </span>
                  <span className="px-3 py-1 text-sm font-medium rounded-full border bg-blue-100 text-blue-800">
                    {cession.montant ? new Intl.NumberFormat('fr-FR', { 
                      style: 'currency', 
                      currency: cession.devise,
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }).format(cession.montant) : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <GestalisButton 
                variant="outline"
                onClick={handleEdit}
                className="border-blue-500 text-blue-600 hover:bg-blue-50"
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
                  <FileText className="h-5 w-5 text-blue-600" />
                  Informations de base
                </GestalisCardTitle>
              </GestalisCardHeader>
              <GestalisCardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Description</label>
                  <p className="text-gray-900">{cession.description || 'Aucune description'}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Date de création</label>
                    <p className="text-gray-900">
                      {cession.dateCreation ? new Date(cession.dateCreation).toLocaleDateString('fr-FR') : 'Non définie'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Statut</label>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(cession.statut)}`}>
                      <StatusIcon className="h-3 w-3 inline mr-1" />
                      {getStatusLabel(cession.statut)}
                    </span>
                  </div>
                </div>
              </GestalisCardContent>
            </GestalisCard>

            {/* Parties impliquées */}
            <GestalisCard>
              <GestalisCardHeader>
                <GestalisCardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  Parties impliquées
                </GestalisCardTitle>
              </GestalisCardHeader>
              <GestalisCardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Client</label>
                    <p className="text-gray-900 font-medium">{cession.clientNom}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Chantier</label>
                    <p className="text-gray-900 font-medium">{cession.chantierNom}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Fournisseur</label>
                    <p className="text-gray-900 font-medium">{cession.fournisseurNom}</p>
                  </div>
                </div>
              </GestalisCardContent>
            </GestalisCard>

            {/* Informations financières */}
            <GestalisCard>
              <GestalisCardHeader>
                <GestalisCardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Informations financières
                </GestalisCardTitle>
              </GestalisCardHeader>
              <GestalisCardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Montant</label>
                    <p className="text-2xl font-bold text-green-600">
                      {cession.montant ? new Intl.NumberFormat('fr-FR', { 
                        style: 'currency', 
                        currency: cession.devise,
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }).format(cession.montant) : 'Non défini'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Devise</label>
                    <p className="text-gray-900">{cession.devise}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Date d'échéance</label>
                    <p className="text-gray-900">
                      {cession.dateEcheance ? new Date(cession.dateEcheance).toLocaleDateString('fr-FR') : 'Non définie'}
                    </p>
                  </div>
                </div>
                
                {cession.conditions && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Conditions spéciales</label>
                    <p className="text-gray-900">{cession.conditions}</p>
                  </div>
                )}
              </GestalisCardContent>
            </GestalisCard>

            {/* Documents */}
            {cession.documents && cession.documents.length > 0 && (
              <GestalisCard>
                <GestalisCardHeader>
                  <GestalisCardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-orange-600" />
                    Documents
                  </GestalisCardTitle>
                </GestalisCardHeader>
                <GestalisCardContent className="space-y-2">
                  {cession.documents.map((doc, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="flex-1 text-gray-900">{doc.nom}</span>
                      <GestalisButton variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger
                      </GestalisButton>
                    </div>
                  ))}
                </GestalisCardContent>
              </GestalisCard>
            )}

            {/* Notes */}
            {cession.notes && (
              <GestalisCard>
                <GestalisCardHeader>
                  <GestalisCardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-purple-600" />
                    Notes
                  </GestalisCardTitle>
                </GestalisCardHeader>
                <GestalisCardContent className="space-y-4">
                  <div>
                    <p className="text-gray-900">{cession.notes}</p>
                  </div>
                </GestalisCardContent>
              </GestalisCard>
            )}
          </div>

          {/* Colonne latérale */}
          <div className="space-y-6">
            {/* Statistiques rapides */}
            <GestalisCard>
              <GestalisCardHeader>
                <GestalisCardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Statistiques
                </GestalisCardTitle>
              </GestalisCardHeader>
              <GestalisCardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Progression</span>
                  <span className="text-sm font-medium text-gray-900">
                    {cession.statut === 'TERMINEE' ? '100%' : 
                     cession.statut === 'EN_COURS' ? '50%' : 
                     cession.statut === 'EN_ATTENTE' ? '25%' : '0%'}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      cession.statut === 'TERMINEE' ? 'bg-green-600' :
                      cession.statut === 'EN_COURS' ? 'bg-blue-600' :
                      cession.statut === 'EN_ATTENTE' ? 'bg-yellow-600' : 'bg-gray-600'
                    }`}
                    style={{
                      width: cession.statut === 'TERMINEE' ? '100%' : 
                             cession.statut === 'EN_COURS' ? '50%' : 
                             cession.statut === 'EN_ATTENTE' ? '25%' : '0%'
                    }}
                  ></div>
                </div>
                
                <div className="pt-2 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    Créée le {cession.dateCreation ? new Date(cession.dateCreation).toLocaleDateString('fr-FR') : 'Date inconnue'}
                  </div>
                </div>
              </GestalisCardContent>
            </GestalisCard>

            {/* Actions rapides */}
            <GestalisCard>
              <GestalisCardHeader>
                <GestalisCardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  Actions rapides
                </GestalisCardTitle>
              </GestalisCardHeader>
              <GestalisCardContent className="space-y-3">
                <GestalisButton 
                  variant="outline" 
                  className="w-full justify-center"
                  onClick={handleEdit}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </GestalisButton>
                
                <GestalisButton 
                  variant="outline" 
                  className="w-full justify-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exporter
                </GestalisButton>
                
                <GestalisButton 
                  variant="danger" 
                  className="w-full justify-center"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </GestalisButton>
              </GestalisCardContent>
            </GestalisCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailCession;
