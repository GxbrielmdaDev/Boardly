import api from './api';

export const getCards = (listId) =>
  api.get(`/api/lists/${listId}/cards`).then((r) => r.data);
export const createCard = (listId, data) =>
  api.post(`/api/lists/${listId}/cards`, data).then((r) => r.data);
export const getCard = (id) => api.get(`/api/cards/${id}`).then((r) => r.data);
export const updateCard = (id, data) =>
  api.put(`/api/cards/${id}`, data).then((r) => r.data);
export const deleteCard = (id) => api.delete(`/api/cards/${id}`);
export const moveCard = (id, data) =>
  api.patch(`/api/cards/${id}/move`, data).then((r) => r.data);
