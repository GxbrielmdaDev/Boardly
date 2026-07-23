import api from './api';

export const getLabels = (boardId) =>
  api.get(`/api/boards/${boardId}/labels`).then((r) => r.data);

export const createLabel = (boardId, data) =>
  api.post(`/api/boards/${boardId}/labels`, data).then((r) => r.data);

export const updateLabel = (id, data) =>
  api.put(`/api/labels/${id}`, data).then((r) => r.data);

export const deleteLabel = (id) => api.delete(`/api/labels/${id}`);
