import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNotes } from '../context/NoteContext';
import NoteCard from '../components/NoteCard';
import NoteService from '../services/noteService';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { loading } = useNotes();
  const [notes, setNotes] = useState([]);
  const [page, setPage] = useState(0);
  const [pagination, setPagination] = useState({ page: 0, totalPages: 0, totalElements: 0, last: true, first: true });

  useEffect(() => { if (query) searchNotes(); }, [query, page]);

  const searchNotes = async () => {
    try {
      const res = await NoteService.searchNotes(query, page, 10);
      setNotes(res.data.content);
      setPagination(res.data);
    } catch (err) { console.error('Search failed', err); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Search Results</h1>
          <p className="page-subtitle">Results for "{query}" — {pagination.totalElements} found</p>
        </div>
      </div>

      {loading ? (
        <div className="spinner-container"><div className="spinner" /></div>
      ) : notes.length === 0 ? (
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <h3>No results found</h3>
          <p>Try a different search term</p>
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