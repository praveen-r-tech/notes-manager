import { createContext, useContext, useState, useCallback } from 'react';
import NoteService from '../services/noteService';

const NoteContext = createContext();

export function NoteProvider({ children }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    last: true,
    first: true,
  });

  const fetchNotes = useCallback(async (page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc') => {
    setLoading(true);
    setError(null);
    try {
      const response = await NoteService.getAllNotes(page, size, sortBy, sortDir);
      setNotes(response.data.content);
      setPagination({
        page: response.data.page,
        size: response.data.size,
        totalElements: response.data.totalElements,
        totalPages: response.data.totalPages,
        last: response.data.last,
        first: response.data.first,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  }, []);

  const createNote = async (noteData) => {
    const response = await NoteService.createNote(noteData);
    return response.data;
  };

  const updateNote = async (id, noteData) => {
    const response = await NoteService.updateNote(id, noteData);
    return response.data;
  };

  const deleteNote = async (id) => {
    await NoteService.deleteNote(id);
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  const togglePin = async (id) => {
    const response = await NoteService.togglePin(id);
    setNotes((prev) => prev.map((note) => (note.id === id ? response.data : note)));
    return response.data;
  };

  const toggleArchive = async (id) => {
    const response = await NoteService.toggleArchive(id);
    setNotes((prev) => prev.filter((note) => note.id !== id));
    return response.data;
  };

  const searchNotes = async (keyword, page = 0, size = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await NoteService.searchNotes(keyword, page, size);
      setNotes(response.data.content);
      setPagination({
        page: response.data.page,
        size: response.data.size,
        totalElements: response.data.totalElements,
        totalPages: response.data.totalPages,
        last: response.data.last,
        first: response.data.first,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <NoteContext.Provider
      value={{
        notes,
        loading,
        error,
        pagination,
        fetchNotes,
        createNote,
        updateNote,
        deleteNote,
        togglePin,
        toggleArchive,
        searchNotes,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NoteContext);
  if (!context) {
    throw new Error('useNotes must be used within a NoteProvider');
  }
  return context;
}