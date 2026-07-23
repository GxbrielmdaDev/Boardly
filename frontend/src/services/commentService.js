import api from './api';

export const getComments = (cardId) =>
  api.get(`/api/cards/${cardId}/comments`).then((r) => r.data);
export const createComment = (cardId, data) =>
  api.post(`/api/cards/${cardId}/comments`, data).then((r) => r.data);
export const deleteComment = (id) => api.delete(`/api/comments/${id}`);
