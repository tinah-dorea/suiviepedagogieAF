import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const consultationService = {
  getSessions: () => axios.get(`${API_URL}/api/consultation/sessions`).then(r => r.data),
  getSessionDetail: (id) => axios.get(`${API_URL}/api/consultation/sessions/${id}`).then(r => r.data),
  getTypeCours: () => axios.get(`${API_URL}/api/consultation/type-cours`).then(r => r.data),
};

export default consultationService;
