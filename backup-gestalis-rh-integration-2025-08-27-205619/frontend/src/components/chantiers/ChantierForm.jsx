import React, { useState, useEffect } from 'react';
import { api } from '@/utils/auth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Save, 
  X, 
  Calendar,
  MapPin,
  DollarSign,
  Users,
  FileText
} from 'lucide-react';

function ChantierForm({ chantier = null, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    nom: '',
    reference: '',
    description: '',
    adresse: '',
    code_postal: '',
    ville: '',
    date_debut: '',
    date_fin_prevue: '',
    budget_initial: '',
    statut: 'en_preparation',
    priorite: 'normale',
    client: null
  });
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClients();
    if (chantier) {
      setFormData({
        nom: chantier.nom || '',
        reference: chantier.reference || '',
        description: chantier.description || '',
        adresse: chantier.adresse || '',
        code_postal: chantier.code_postal || '',
        ville: chantier.ville || '',
        date_debut: chantier.date_debut ? chantier.date_debut.split('T')[0] : '',
        date_fin_prevue: chantier.date_fin_prevue ? chantier.date_fin_prevue.split('T')[0] : '',
        budget_initial: chantier.budget_initial || '',
        statut: chantier.statut || 'en_preparation',
        priorite: chantier.priorite || 'normale',
        client: chantier.client?.id || null
      });
    }
  }, [chantier]);

  const fetchClients = async () => {
    try {
      const response = await api.get('/chantiers/'); // Utilise l'endpoint chantiers pour récupérer les clients
      // Pour l'instant, on utilise des données mockées car l'endpoint clients n'existe pas
      setClients([
        { id: 1, nom: 'Client A', type: 'entreprise' },
        { id: 2, nom: 'Client B', type: 'particulier' },
        { id: 3, nom: 'Client C', type: 'collectivite' }
      ]);
    } catch (error) {
      console.error('Erreur lors du chargement des clients:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSend = {
        ...formData,
        budget_initial: formData.budget_initial ? parseFloat(formData.budget_initial) : null,
        client: formData.client
      };

      if (chantier) {
        await api.put(`/chantiers/${chantier.id}/`, dataToSend);
      } else {
        await api.post('/chantiers/', dataToSend);
      }

      onSave();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {chantier ? 'Modifier le chantier' : 'Nouveau chantier'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations générales */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nom">Nom du chantier *</Label>
                <Input
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => handleChange('nom', e.target.value)}
                  placeholder="Nom du chantier"
                  required
                />
              </div>
              <div>
                <Label htmlFor="reference">Référence *</Label>
                <Input
                  id="reference"
                  value={formData.reference}
                  onChange={(e) => handleChange('reference', e.target.value)}
                  placeholder="CH001"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Description du chantier"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="adresse">Adresse</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="adresse"
                    value={formData.adresse}
                    onChange={(e) => handleChange('adresse', e.target.value)}
                    placeholder="Adresse du chantier"
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="code_postal">Code postal</Label>
                <Input
                  id="code_postal"
                  value={formData.code_postal}
                  onChange={(e) => handleChange('code_postal', e.target.value)}
                  placeholder="75001"
                />
              </div>
              <div>
                <Label htmlFor="ville">Ville</Label>
                <Input
                  id="ville"
                  value={formData.ville}
                  onChange={(e) => handleChange('ville', e.target.value)}
                  placeholder="Paris"
                />
              </div>
            </div>

              <div>
                <Label htmlFor="client">Client</Label>
                <select
                  id="client"
                  value={formData.client || ''}
                  onChange={(e) => handleChange('client', e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Sélectionner un client</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.nom} ({client.type})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Dates et budget */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date_debut">Date de début</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="date_debut"
                    type="date"
                    value={formData.date_debut}
                    onChange={(e) => handleChange('date_debut', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="date_fin_prevue">Date de fin prévue</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="date_fin_prevue"
                    type="date"
                    value={formData.date_fin_prevue}
                    onChange={(e) => handleChange('date_fin_prevue', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="budget_initial">Budget initial (€)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="budget_initial"
                    type="number"
                    value={formData.budget_initial}
                    onChange={(e) => handleChange('budget_initial', e.target.value)}
                    placeholder="0"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="statut">Statut</Label>
                <select
                  id="statut"
                  value={formData.statut}
                  onChange={(e) => handleChange('statut', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="en_preparation">En préparation</option>
                  <option value="en_cours">En cours</option>
                  <option value="suspendu">Suspendu</option>
                  <option value="termine">Terminé</option>
                  <option value="annule">Annulé</option>
                </select>
              </div>

              <div>
                <Label htmlFor="priorite">Priorité</Label>
                <select
                  id="priorite"
                  value={formData.priorite}
                  onChange={(e) => handleChange('priorite', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="basse">Basse</option>
                  <option value="normale">Normale</option>
                  <option value="haute">Haute</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default ChantierForm; 