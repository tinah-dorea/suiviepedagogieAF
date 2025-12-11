import api from './api';

const baseURL = '/sessions';

const sessionService = {
    // Récupérer toutes les sessions
    getAll: async () => {
        try {
            const response = await api.get(baseURL);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Récupérer une session par ID
    getById: async (id) => {
        try {
            const response = await api.get(`${baseURL}/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Récupérer les sessions par type de cours
    getByTypeCours: async (typeCoursId) => {
        try {
            const response = await api.get(`${baseURL}/type-cours/${typeCoursId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Récupérer les sessions actives
    getSessionsActives: async () => {
        try {
            const response = await api.get(`${baseURL}/actives`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Créer une nouvelle session
    create: async (data) => {
        try {
            const response = await api.post(baseURL, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Mettre à jour une session
    update: async (id, data) => {
        try {
            const response = await api.put(`${baseURL}/${id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Supprimer une session
    delete: async (id) => {
        try {
            const response = await api.delete(`${baseURL}/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default sessionService;