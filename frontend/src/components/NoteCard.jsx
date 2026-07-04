import { useNavigate } from 'react-router-dom';
import { useNotes } from '../context/NoteContext';
import { useToast } from '../context/ToastContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export default function NoteCard({ note }) {
  const navigate = useNavigate();
  const { togglePin, toggleArchive, deleteNote } = useNotes();
  const toast = useToast();

  const handlePin = async (e) => {
    e.stopPropagation();
    try {
      await togglePin(note.id);
      toast.success(note.pinned ? 'Note unpinned' : 'Note pinned');
    } catch {
      toast.error('Failed to toggle pin');
    }
  };

  const handleArchive = async (e) => {
    e.stopPropagation();
    try {
      await toggleArchive(note.id);
      toast.success(note.archived ? 'Note restored' : 'Note archived');
    } catch {
      toast.error('Failed to toggle archive');
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote(note.id);
        toast.success('Note deleted');
      } catch {
        toast.error('Failed to delete note');
      }
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDownloadUrl = (attachmentId) => {
    return `${API_BASE_URL}/api/files/${attachmentId}/download`;
  };

  return (
    <div
      className={`note-card ${note.pinned ? 'pinned' : ''}`}
      onClick={() => navigate(`/notes/${note.id}`)}
    >
      <div className="note-card-header">
        <h3 className="note-card-title">{note.title}</h3>
      </div>
      <p className="note-card-content">{note.content}</p>
      {note.tags && note.tags.length > 0 && (
        <div className="note-card-tags">
          {note.tags.map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>
      )}
      {note.attachmentName && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, fontSize: '0.8rem', color: 'var(--gray-500)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
          <span>{note.attachmentName}</span>
        </div>
      )}
      <div className="note-card-footer">
        <span className="note-card-date">{formatDate(note.createdAt)}</span>
        <div className="note-card-actions">
          <button
            className={`pin-btn ${note.pinned ? 'active' : ''}`}
            onClick={handlePin}
            title={note.pinned ? 'Unpin' : 'Pin'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={note.pinned ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          </button>
          <button className="archive-btn" onClick={handleArchive} title={note.archived ? 'Restore' : 'Archive'}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 8v13H3V8M1 3h22v5H1zM10 12h4"/></svg>
          </button>
          <button className="delete-btn" onClick={handleDelete} title="Delete">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}