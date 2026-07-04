import { useEffect, useState } from 'react';
import { useNotes } from '../context/NoteContext';
import NoteCard from '../components/NoteCard';
import NoteService from '../services/noteService';

export default function PinnedNotes() {
  const { loading } = useNotes();
  const [notes, setNotes] = useState([]);
  const [page, setPage] = useState(0);
  const [pagination, setPagination] = useState({ page: 0, totalPages: 0, totalElements: 0, last: true, first: true });

  useEffect(() => { loadPinned(); }, [page]);

  const loadPinned = async () => {
    try {
      const res = await NoteService.getPinnedNotes(page, 10);
      setNotes(res.data.content);
      setPagination({ page: res.data.page, totalPages: res.data.totalPages, totalElements: res.data.totalElements, last: res.data.last, first: res.data.first });
    } catch (err) { console.error('Failed to load pinned notes', err); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Pinned Notes</h1>
          <p className="page-subtitle">{pagination.totalElements} pinned note(s)</p>
        </div>
      </div>

      {loading ? (
        <div className="spinner-container"><div className="spinner" /></div>
      ) : notes.length === 0 ? (
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          <h3>No pinned notes</h3>
          <p>Pin important notes to find them quickly</p>
        </div>
      ) : (
        <>
          <div className="notes-grid">
            {notes.map((note) => (<NoteCard key={note.id} note={note} />))}
          </div>
          <div className="pagination">
            <button disabled={pagination.first} onClick={() => setPage(p => p - 1)}>Previous</button>
            <span className="pagination-info">Page {pagination.page + 1} of {pagination.totalPages || 1}</span>
            <button disabled={pagination.last} onClick={() => setPage(p => p + 1)}>Next</button>
          </div>
        </>
      )}
    </div>
  );
}