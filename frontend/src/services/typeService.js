import api from './api';

const typeServiceApi = {
  // Récupérer tous les types de service (route publique, sans authentification)
  getAll: async () => {
    const response = await api.get('/type-services');
    return response.data;
  },
};

export default typeServiceApi;
