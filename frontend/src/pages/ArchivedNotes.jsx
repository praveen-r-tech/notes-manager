import { useEffect, useState } from 'react';
import { useNotes } from '../context/NoteContext';
import NoteCard from '../components/NoteCard';
import NoteService from '../services/noteService';

export default function ArchivedNotes() {
  const { loading } = useNotes();
  const [notes, setNotes] = useState([]);
  const [page, setPage] = useState(0);
  const [pagination, setPagination] = useState({ page: 0, totalPages: 0, totalElements: 0, last: true, first: true });

  useEffect(() => { loadArchived(); }, [page]);

  const loadArchived = async () => {
    try {
      const res = await NoteService.getArchivedNotes(page, 10);
      setNotes(res.data.content);
      setPagination({ page: res.data.page, totalPages: res.data.totalPages, totalElements: res.data.totalElements, last: res.data.last, first: res.data.first });
    } catch (err) { console.error('Failed to load archived notes', err); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Archived Notes</h1>
          <p className="page-subtitle">{pagination.totalElements} archived note(s)</p>
        </div>
      </div>

      {loading ? (
        <div className="spinner-container"><div className="spinner" /></div>
      ) : notes.length === 0 ? (
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 8v13H3V8M1 3h22v5H1zM10 12h4"/></svg>
          <h3>No archived notes</h3>
          <p>Archive notes you want to keep but don't need right now</p>
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