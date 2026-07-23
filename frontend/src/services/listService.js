import api from './api';

export const getLists = (boardId) =>
  api.get(`/api/boards/${boardId}/lists`).then((r) => r.data);
export const createList = (boardId, data) =>
  api.post(`/api/boards/${boardId}/lists`, data).then((r) => r.data);
export const updateList = (id, data) =>
  api.put(`/api/lists/${id}`, data).then((r) => r.data);
export const deleteList = (id) => api.delete(`/api/lists/${id}`);
export const reorderList = (id, position) =>
  api.patch(`/api/lists/${id}/position`, { position }).then((r) => r.data);
