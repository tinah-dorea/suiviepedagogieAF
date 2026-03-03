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

const createEmploye = (data) => {
    return api.post('/employes', data);
};

const updateEmploye = (id, data) => {
    return api.put(`/employes/${id}`, data);
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
