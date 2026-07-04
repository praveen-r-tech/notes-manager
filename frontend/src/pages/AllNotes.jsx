import { useEffect, useState } from 'react';
import { useNotes } from '../context/NoteContext';
import NoteCard from '../components/NoteCard';

export default function AllNotes() {
  const { notes, loading, fetchNotes, pagination } = useNotes();
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');

  useEffect(() => {
    fetchNotes(page, 10, sortBy, sortDir);
  }, [page, sortBy, sortDir]);

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(0);
  };

  const handleDirChange = () => {
    setSortDir((prev) => (prev === 'desc' ? 'asc' : 'desc'));
    setPage(0);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">All Notes</h1>
          <p className="page-subtitle">{pagination.totalElements} note(s) found</p>
        </div>
      </div>

      <div className="sort-controls">
        <select value={sortBy} onChange={handleSortChange}>
          <option value="createdAt">Created Date</option>
          <option value="updatedAt">Updated Date</option>
          <option value="title">Title</option>
        </select>
        <button className="btn btn-secondary btn-sm" onClick={handleDirChange}>
          {sortDir === 'desc' ? '↓ Newest' : '↑ Oldest'}
        </button>
      </div>

      {loading ? (
        <div className="spinner-container"><div className="spinner" /></div>
      ) : notes.length === 0 ? (
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>
          <h3>No notes found</h3>
          <p>Create a new note to get started</p>
        </div>
      ) : (
        <>
          <div className="notes-grid">
            {notes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>

          <div className="pagination">
            <button disabled={pagination.first} onClick={() => setPage((p) => p - 1)}>Previous</button>
            {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
              const startPage = Math.max(0, pagination.page - 2);
              const pageNum = startPage + i;
              if (pageNum >= pagination.totalPages) return null;
              return (
                <button
                  key={pageNum}
                  className={pageNum === pagination.page ? 'active' : ''}
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum + 1}
                </button>
              );
            })}
            <button disabled={pagination.last} onClick={() => setPage((p) => p + 1)}>Next</button>
            <span className="pagination-info">Page {pagination.page + 1} of {pagination.totalPages || 1}</span>
          </div>
        </>
      )}
    </div>
  );
}