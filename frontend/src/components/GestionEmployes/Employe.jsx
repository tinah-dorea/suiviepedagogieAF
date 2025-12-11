import React, { useState, useEffect } from 'react';
import { getEmployes, getRoles, toggleStatus, deleteEmploye, createEmploye, updateEmploye } from '../../services/employeService';
import Modal from '../ui/Modal';

const Employe = () => {
    const [employes, setEmployes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [currentEmploye, setCurrentEmploye] = useState(null);
    const [formData, setFormData] = useState({
        service: '',
        nom: '',
        prenom: '',
        age: '',
        adresse: '',
        tel: '',
        email: '',
        mot_passe: '',
        id_role: 1,
    });
    const [error, setError] = useState('');
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        setLoading(true);
        try {
            const [employesData, rolesData] = await Promise.all([getEmployes(), getRoles()]);
            setEmployes(employesData);
            setRoles(rolesData);
        } catch (err) {
            console.error("Erreur chargement données:", err);
            setError("Erreur lors du chargement des données initiales.");
        } finally {
            setLoading(false);
        }
    };

    const openModal = (mode, employe = null) => {
        setModalMode(mode);
        if (mode === 'edit' && employe) {
            setCurrentEmploye(employe);
            setFormData({
                service: employe.service || '',
                nom: employe.nom,
                prenom: employe.prenom,
                age: employe.age || '',
                adresse: employe.adresse || '',
                tel: employe.tel || '',
                email: employe.email,
                mot_passe: '',
                id_role: employe.id_role || 1,
            });
        } else {
            setCurrentEmploye(null);
            setFormData({
                service: '',
                nom: '',
                prenom: '',
                age: '',
                adresse: '',
                tel: '',
                email: '',
                mot_passe: '',
                id_role: 1,
            });
        }
        setError('');
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setError('');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const submitData = { ...formData };
            if (modalMode === 'edit' && !submitData.mot_passe) {
                delete submitData.mot_passe;
            }

            if (modalMode === 'add') {
                await createEmploye(submitData);
            } else {
                await updateEmploye(currentEmploye.id, submitData);
            }
            
            const data = await getEmployes();
            setEmployes(data);
            closeModal();
        } catch (err) {
            console.error('Erreur lors de la soumission:', err);
            setError(
                err.response?.data?.message || 
                "Une erreur est survenue lors de l'opération. Veuillez réessayer."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (id, is_active) => {
        try {
            setLoading(true);
            await toggleStatus(id, !is_active);
            const data = await getEmployes();
            setEmployes(data);
        } catch (err) {
            console.error('Erreur lors de la modification du statut:', err);
            setError("Erreur lors de la modification du statut. Veuillez réessayer.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const employe = employes.find(e => e.id === id);
        if (!employe) return;

        if (employe.is_active) {
            if (window.confirm("Êtes-vous sûr de vouloir désactiver cet employé ?")) {
                try {
                    setLoading(true);
                    await deleteEmploye(id);
                    const data = await getEmployes();
                    setEmployes(data);
                } catch (err) {
                    console.error('Erreur lors de la désactivation:', err);
                    const errorMessage = err.response?.data?.message || "Erreur lors de la désactivation. Veuillez réessayer.";
                    alert(errorMessage);
                } finally {
                    setLoading(false);
                }
            }
        } else {
            alert("Cet employé est déjà désactivé.");
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Gestion des Utilisateurs</h1>
                <button
                    onClick={() => openModal('add')}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    + Ajouter Employé
                </button>
            </div>

            {loading ? (
                <p className="text-center py-4">Chargement...</p>
            ) : error ? (
                <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>
            ) : (
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left py-3 px-4">Utilisateur</th>
                                <th className="text-left py-3 px-4">Service</th>
                                <th className="text-left py-3 px-4">Email</th>
                                <th className="text-left py-3 px-4">Rôle</th>
                                <th className="text-left py-3 px-4">Statut</th>
                                <th className="text-left py-3 px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employes.map(emp => (
                                <tr key={emp.id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-4 font-medium">{emp.nom} {emp.prenom}</td>
                                    <td className="py-3 px-4">{emp.service || '-'}</td>
                                    <td className="py-3 px-4">{emp.email}</td>
                                    <td className="py-3 px-4">
                                        <span className="px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800">
                                            {roles.find(r => r.id === emp.id_role)?.nom_role || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-0.5 rounded text-xs ${
                                            emp.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'
                                        }`}>
                                            {emp.is_active ? 'Actif' : 'Désactivé'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 space-x-2">
                                        <button onClick={() => openModal('edit', emp)} className="text-sm text-blue-600 hover:underline">Éditer</button>
                                        <button onClick={() => handleToggleStatus(emp.id, emp.is_active)} className={`text-sm hover:underline ${emp.is_active ? 'text-yellow-600' : 'text-green-600'}`}>
                                            {emp.is_active ? 'Désactiver' : 'Activer'}
                                        </button>
                                        <button onClick={() => handleDelete(emp.id)} className="text-sm text-red-600 hover:underline">Supprimer</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {modalOpen && (
                <Modal onClose={closeModal} title={modalMode === 'add' ? 'Ajouter un Employé' : 'Modifier un Employé'}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && <p className="text-red-500 bg-red-100 p-2 rounded">{error}</p>}
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input name="nom" placeholder="Nom *" value={formData.nom} onChange={handleInputChange} required className="w-full p-2 border rounded" />
                            <input name="prenom" placeholder="Prénom *" value={formData.prenom} onChange={handleInputChange} required className="w-full p-2 border rounded" />
                        </div>
                        
                        <input name="email" type="email" placeholder="Email *" value={formData.email} onChange={handleInputChange} required className="w-full p-2 border rounded" />
                        <input name="service" placeholder="Service" value={formData.service} onChange={handleInputChange} className="w-full p-2 border rounded" />
                        <input name="tel" placeholder="Téléphone" value={formData.tel} onChange={handleInputChange} className="w-full p-2 border rounded" />

                        {modalMode === 'add' && (
                            <input name="mot_passe" type="password" placeholder="Mot de passe *" value={formData.mot_passe} onChange={handleInputChange} required className="w-full p-2 border rounded" />
                        )}

                        <select name="id_role" value={formData.id_role} onChange={handleInputChange} required className="w-full p-2 border rounded">
                            <option value="">Sélectionnez un rôle *</option>
                            {roles.map(role => (
                                <option key={role.id} value={role.id}>{role.nom_role}</option>
                            ))}
                        </select>

                        <div className="flex justify-end space-x-2 pt-4">
                            <button type="button" onClick={closeModal} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Annuler</button>
                            <button type="submit" className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600">{modalMode === 'add' ? 'Ajouter' : 'Modifier'}</button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default Employe;
