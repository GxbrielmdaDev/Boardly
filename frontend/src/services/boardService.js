import api from './api';

export const getBoards = () => api.get('/api/boards').then((r) => r.data);
export const getBoard = (id) => api.get(`/api/boards/${id}`).then((r) => r.data);
export const createBoard = (data) => api.post('/api/boards', data).then((r) => r.data);
export const updateBoard = (id, data) => api.put(`/api/boards/${id}`, data).then((r) => r.data);
export const deleteBoard = (id) => api.delete(`/api/boards/${id}`);
