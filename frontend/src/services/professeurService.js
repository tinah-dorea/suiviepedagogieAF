import api from './api';

const getProfesseurs = () => {
    return api.get('/employes/professeurs');
};

const getEmployes = () => {
    return api.get('/employes');
};

const getRoles = () => {
    return api.get('/employes/roles');
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
    getProfesseurs,
    getEmployes,
    getRoles,
    createEmploye,
    updateEmploye,
    toggleStatus,
    deleteEmploye
};

export default professeurService;
