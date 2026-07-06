import api from './api';

const NoteService = {
  getAllNotes: (page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc') =>
    api.get('/notes', { params: { page, size, sortBy, sortDir } }),

  getNoteById: (id) => api.get(`/notes/${id}`),

  createNote: (noteData) => api.post('/notes', noteData),

  updateNote: (id, noteData) => api.put(`/notes/${id}`, noteData),

  deleteNote: (id) => api.delete(`/notes/${id}`),

  togglePin: (id) => api.patch(`/notes/${id}/pin`),

  toggleArchive: (id) => api.patch(`/notes/${id}/archive`),

  getPinnedNotes: (page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc') =>
    api.get('/notes/pinned', { params: { page, size, sortBy, sortDir } }),

  getArchivedNotes: (page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc') =>
    api.get('/notes/archived', { params: { page, size, sortBy, sortDir } }),

  searchNotes: (keyword, page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc') =>
    api.get('/notes/search', { params: { keyword, page, size, sortBy, sortDir } }),

  uploadAttachment: async (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/notes/${id}/attachment`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(errBody || `Upload failed: ${response.status}`);
    }
    return { data: await response.json() };
  },

  deleteAttachment: (id) => api.delete(`/notes/${id}/attachment`),
};

export default NoteService;