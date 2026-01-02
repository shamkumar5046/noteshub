import api from './api';

export const notesService = {
  uploadNote: async (formData) => {
    const response = await api.post('/notes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getNotes: async (params = {}) => {
    const response = await api.get('/notes', { params });
    return response.data;
  },

  getNote: async (id) => {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  },

  likeNote: async (id) => {
    const response = await api.post(`/notes/${id}/like`);
    return response.data;
  },

  reportNote: async (id, reason) => {
    const response = await api.post(`/notes/${id}/report`, { reason });
    return response.data;
  },

  incrementDownload: async (id) => {
    const response = await api.post(`/notes/${id}/download`);
    return response.data;
  },

  verifyNote: async (id) => {
    const response = await api.post(`/notes/${id}/verify`);
    return response.data;
  },
};

