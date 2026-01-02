import api from './api';

export const questionPaperService = {
  uploadQuestionPaper: async (formData) => {
    const response = await api.post('/question-papers/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getQuestionPapers: async (params = {}) => {
    const response = await api.get('/question-papers', { params });
    return response.data;
  },

  getQuestionPaper: async (id) => {
    const response = await api.get(`/question-papers/${id}`);
    return response.data;
  },

  likeQuestionPaper: async (id) => {
    const response = await api.post(`/question-papers/${id}/like`);
    return response.data;
  },

  reportQuestionPaper: async (id, reason) => {
    const response = await api.post(`/question-papers/${id}/report`, { reason });
    return response.data;
  },

  incrementDownload: async (id) => {
    const response = await api.post(`/question-papers/${id}/download`);
    return response.data;
  },
};

