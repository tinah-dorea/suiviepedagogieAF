import React, { useState, useEffect } from 'react';
import roleService from '../../services/roleService';
import Modal from '../ui/Modal';

const Role = () => {
    const [roles, setRoles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentRole, setCurrentRole] = useState(null);
    const [formData, setFormData] = useState({ nom_role: '' });

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        setIsLoading(true);
        try {
            const response = await roleService.getAllRoles();
            setRoles(response.data);
        } catch (err) {
            setError(err.message || 'Une erreur est survenue');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (currentRole) {
                await roleService.updateRole(currentRole.id, formData);
            } else {
                await roleService.createRole(formData);
            }
            fetchRoles();
            closeModal();
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Une erreur est survenue');
        } finally {
            setIsLoading(false);
        }
    };

    const openModal = (role = null) => {
        setCurrentRole(role);
        setFormData(role ? { nom_role: role.nom_role } : { nom_role: '' });
        setError(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setCurrentRole(null);
        setFormData({ nom_role: '' });
        setIsModalOpen(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce rôle ?')) {
            setIsLoading(true);
            try {
                await roleService.deleteRole(id);
                fetchRoles();
            } catch (err) {
                setError(err.response?.data?.message || 'Impossible de supprimer ce rôle.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Gestion des Rôles</h1>
            <button
                onClick={() => openModal()}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
            >
                Ajouter un Rôle
            </button>

            {isLoading && <p>Chargement...</p>}
            {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>}

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="py-2 px-4 border-b">Nom du Rôle</th>
                            <th className="py-2 px-4 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roles.map((role) => (
                            <tr key={role.id} className="hover:bg-gray-100">
                                <td className="py-2 px-4 border-b text-center">{role.nom_role}</td>
                                <td className="py-2 px-4 border-b text-center">
                                    <button
                                        onClick={() => openModal(role)}
                                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2"
                                    >
                                        Modifier
                                    </button>
                                    <button
                                        onClick={() => handleDelete(role.id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                    >
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <Modal onClose={closeModal} title={currentRole ? 'Modifier le Rôle' : 'Ajouter un Rôle'}>
                    <form onSubmit={handleFormSubmit}>
                        <div className="mb-4">
                            <label htmlFor="nom_role" className="block text-sm font-medium text-gray-700">
                                Nom du Rôle
                            </label>
                            <input
                                type="text"
                                id="nom_role"
                                name="nom_role"
                                value={formData.nom_role}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 mr-2"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
                            >
                                {isLoading ? 'Enregistrement...' : 'Enregistrer'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default Role;
