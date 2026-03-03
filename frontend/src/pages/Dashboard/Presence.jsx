import React, { useState, useEffect } from 'react';
import { ClipboardDocumentCheckIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import groupeService from '../../services/groupeService';
import inscriptionService from '../../services/inscriptionService';
import presenceService from '../../services/presenceService';

const Presence = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [apprenants, setApprenants] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingApprenants, setLoadingApprenants] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const data = await groupeService.getAllGroupes();
        setGroups(data || []);
      } catch (err) {
        setError('Impossible de charger les groupes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      const fetchApprenants = async () => {
        try {
          setLoadingApprenants(true);
          const data = await inscriptionService.getApprenantsByGroupe(selectedGroup);
          setApprenants(data || []);
          
          // Initialiser l'état de présence pour chaque apprenant (absent par défaut)
          const initialAttendance = {};
          data.forEach(apprenant => {
            initialAttendance[apprenant.id] = false;
          });
          setAttendance(initialAttendance);
        } catch (err) {
          setError('Impossible de charger les apprenants');
          console.error(err);
        } finally {
          setLoadingApprenants(false);
        }
      };

      fetchApprenants();
    }
  }, [selectedGroup]);

  const handleTogglePresence = (apprenantId) => {
    setAttendance(prev => ({
      ...prev,
      [apprenantId]: !prev[apprenantId]
    }));
  };

  const handleSaveAttendance = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage('');

      // Préparer les données de présence
      const presentCount = Object.values(attendance).filter(Boolean).length;
      
      // Envoyer les données au serveur
      await presenceService.recordAttendance({
        groupe_id: selectedGroup,
        date: new Date().toISOString().split('T')[0],
        apprenants: apprenants.map(a => ({
          apprenant_id: a.id,
          present: attendance[a.id] || false
        }))
      });

      setSuccessMessage(`✓ Présence enregistrée! ${presentCount} apprenant${presentCount > 1 ? 's' : ''} présent${presentCount > 1 ? 's' : ''}`);
      
      // Réinitialiser après 3 secondes
      setTimeout(() => {
        const initialAttendance = {};
        apprenants.forEach(apprenant => {
          initialAttendance[apprenant.id] = false;
        });
        setAttendance(initialAttendance);
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      setError('Erreur lors de l\'enregistrement de la présence');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const selectedGroupName = groups.find(g => g.id === selectedGroup)?.nom || 'Non défini';
  const presentCount = Object.values(attendance).filter(Boolean).length;
  const totalCount = apprenants.length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-700 text-white p-6 rounded-lg">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <ClipboardDocumentCheckIcon className="h-8 w-8" />
          Appel (Présence)
        </h1>
        <p className="mt-2 text-amber-100">Enregistrez la présence des apprenants par groupe</p>
      </div>

      {/* Sélection du groupe */}
      <div className="bg-white rounded-lg shadow p-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Sélectionner un groupe
        </label>
        <select
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          value={selectedGroup || ''}
          onChange={(e) => setSelectedGroup(parseInt(e.target.value))}
        >
          <option value="">-- Choisir un groupe --</option>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.nom}
            </option>
          ))}
        </select>
      </div>

      {selectedGroup && (
        <>
          {/* Résumé du groupe */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-700 font-semibold">Groupe: {selectedGroupName}</p>
                <p className="text-amber-600 text-sm mt-1">
                  Date de l'appel: {new Date().toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-amber-700">{presentCount}/{totalCount}</p>
                <p className="text-amber-600 text-sm">Présents</p>
              </div>
            </div>
          </div>

          {/* Liste des apprenants */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {loadingApprenants ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
              </div>
            ) : apprenants.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <ClipboardDocumentCheckIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Aucun apprenant dans le groupe {selectedGroupName}</p>
              </div>
            ) : (
              <div className="divide-y">
                {apprenants.map((apprenant, index) => (
                  <div
                    key={apprenant.id || index}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {apprenant.prenom} {apprenant.nom}
                      </p>
                      <p className="text-sm text-gray-600">{apprenant.email}</p>
                    </div>
                    
                    <button
                      onClick={() => handleTogglePresence(apprenant.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                        attendance[apprenant.id]
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {attendance[apprenant.id] ? (
                        <>
                          <CheckIcon className="h-5 w-5" />
                          Présent
                        </>
                      ) : (
                        <>
                          <XMarkIcon className="h-5 w-5" />
                          Absent
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Messages */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded flex items-center gap-2">
              <CheckIcon className="h-5 w-5" />
              {successMessage}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Bouton Enregistrer */}
          {!loadingApprenants && apprenants.length > 0 && (
            <div className="flex justify-between">
              <button
                onClick={() => {
                  const initialAttendance = {};
                  apprenants.forEach(apprenant => {
                    initialAttendance[apprenant.id] = false;
                  });
                  setAttendance(initialAttendance);
                }}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Réinitialiser
              </button>
              <button
                onClick={handleSaveAttendance}
                disabled={saving}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition ${
                  saving
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                <ClipboardDocumentCheckIcon className="h-5 w-5" />
                {saving ? 'Enregistrement...' : 'Enregistrer la Présence'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Presence;
