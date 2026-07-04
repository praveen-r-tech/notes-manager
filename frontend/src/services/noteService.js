import api from './api';

const NoteService = {
  getAllNotes: (page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc') =>
    api.get('/api/notes', { params: { page, size, sortBy, sortDir } }),

  getNoteById: (id) => api.get(`/api/notes/${id}`),

  createNote: (noteData) => api.post('/api/notes', noteData),

  updateNote: (id, noteData) => api.put(`/api/notes/${id}`, noteData),

  deleteNote: (id) => api.delete(`/api/notes/${id}`),

  togglePin: (id) => api.patch(`/api/notes/${id}/pin`),

  toggleArchive: (id) => api.patch(`/api/notes/${id}/archive`),

  getPinnedNotes: (page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc') =>
    api.get('/api/notes/pinned', { params: { page, size, sortBy, sortDir } }),

  getArchivedNotes: (page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc') =>
    api.get('/api/notes/archived', { params: { page, size, sortBy, sortDir } }),

  searchNotes: (keyword, page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc') =>
    api.get('/api/notes/search', { params: { keyword, page, size, sortBy, sortDir } }),

  uploadAttachment: (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/api/notes/${id}/attachment`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  deleteAttachment: (id) => api.delete(`/api/notes/${id}/attachment`),
};

export default NoteService;