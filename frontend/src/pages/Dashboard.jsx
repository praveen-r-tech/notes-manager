import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotes } from '../context/NoteContext';
import NoteCard from '../components/NoteCard';
import NoteService from '../services/noteService';

export default function Dashboard() {
  const navigate = useNavigate();
  const { fetchNotes, notes, loading } = useNotes();
  const [stats, setStats] = useState({ total: 0, pinned: 0, archived: 0 });

  useEffect(() => {
    fetchNotes(0, 6);
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [allRes, pinnedRes, archivedRes] = await Promise.all([
        NoteService.getAllNotes(0, 1),
        NoteService.getPinnedNotes(0, 1),
        NoteService.getArchivedNotes(0, 1),
      ]);
      setStats({
        total: allRes.data.totalElements,
        pinned: pinnedRes.data.totalElements,
        archived: archivedRes.data.totalElements,
      });
    } catch (err) {
      console.error('Failed to load stats', err);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of your notes</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/notes/new')}>
          + New Note
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <div style={{ background: 'var(--white)', padding: 20, borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginBottom: 8 }}>Total Notes</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>{stats.total}</div>
        </div>
        <div style={{ background: 'var(--white)', padding: 20, borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginBottom: 8 }}>Pinned</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--secondary)' }}>{stats.pinned}</div>
        </div>
        <div style={{ background: 'var(--white)', padding: 20, borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginBottom: 8 }}>Archived</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--gray-500)' }}>{stats.archived}</div>
        </div>
      </div>

      <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 16 }}>Recent Notes</h2>

      {loading ? (
        <div className="spinner-container"><div className="spinner" /></div>
      ) : notes.length === 0 ? (
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>
          <h3>No notes yet</h3>
          <p>Create your first note to get started</p>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/notes/new')}>Create Note</button>
        </div>
      ) : (
        <div className="notes-grid">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}

      {notes.length > 0 && (
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <button className="btn btn-secondary" onClick={() => navigate('/notes')}>View All Notes</button>
        </div>
      )}
    </div>
  );
}