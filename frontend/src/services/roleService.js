import api from './api';

const getAllRoles = () => {
    return api.get('/roles');
};

const getRoleById = (id) => {
    return api.get(`/roles/${id}`);
};

const createRole = (data) => {
    return api.post('/roles', data);
};

const updateRole = (id, data) => {
    return api.put(`/roles/${id}`, data);
};

const deleteRole = (id) => {
    return api.delete(`/roles/${id}`);
};

const roleService = {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole
};

export default roleService;
