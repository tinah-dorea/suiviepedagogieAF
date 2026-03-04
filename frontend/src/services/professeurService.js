import api from './api';

const getProfesseurs = async () => {
    const response = await api.get('/professeurs');
    return response.data;
};

const getEmployes = async () => {
    const response = await api.get('/employes');
    return response.data;
};

const getRoles = async () => {
    const response = await api.get('/employes/roles');
    return response.data;
};

const createEmploye = async (data) => {
    console.log('[professeurService] createEmploye - Données:', data);
    const response = await api.post('/employes', data);
    console.log('[professeurService] createEmploye - Réponse:', response);
    return response;
};

const updateEmploye = async (id, data) => {
    console.log('[professeurService] updateEmploye - ID:', id, 'Données:', data);
    const response = await api.put(`/employes/${id}`, data);
    console.log('[professeurService] updateEmploye - Réponse:', response);
    return response;
};

const toggleStatus = (id, is_active) => {
    return api.patch(`/employes/${id}/status`, { is_active });
};

const deleteEmploye = (id) => {
    return api.delete(`/employes/${id}`);
};


const professeurService = {
    getAll: getProfesseurs,
    getProfesseurs,
    getEmployes,
    getRoles,
    createEmploye,
    updateEmploye,
    toggleStatus,
    deleteEmploye
};

export default professeurService;
