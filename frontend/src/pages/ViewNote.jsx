import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useNotes } from '../context/NoteContext';
import { useToast } from '../context/ToastContext';
import NoteService from '../services/noteService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export default function ViewNote() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { togglePin, toggleArchive, deleteNote } = useNotes();
  const toast = useToast();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadNote(); }, [id]);

  const loadNote = async () => {
    try {
      const res = await NoteService.getNoteById(id);
      setNote(res.data);
    } catch { toast.error('Note not found'); navigate('/notes'); }
    finally { setLoading(false); }
  };

  const handlePin = async () => {
    try { const res = await togglePin(id); setNote(res); toast.success(res.pinned ? 'Note pinned' : 'Note unpinned'); }
    catch { toast.error('Failed to toggle pin'); }
  };

  const handleArchive = async () => {
    try { await toggleArchive(id); toast.success('Note archived'); navigate('/notes'); }
    catch { toast.error('Failed to archive note'); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this note permanently?')) return;
    try { await deleteNote(id); toast.success('Note deleted'); navigate('/notes'); }
    catch { toast.error('Failed to delete note'); }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) { toast.error('File must be under 20MB'); return; }
    try {
      const res = await NoteService.uploadAttachment(id, file);
      setNote(res.data);
      toast.success('File uploaded');
    } catch { toast.error('Failed to upload file'); }
  };

  const handleDeleteAttachment = async () => {
    try {
      const res = await NoteService.deleteAttachment(id);
      setNote(res.data);
      toast.success('Attachment removed');
    } catch { toast.error('Failed to delete attachment'); }
  };

  const formatDate = (d) => new Date(d).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  const formatSize = (bytes) => { if (!bytes) return ''; const mb = bytes / (1024 * 1024); return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`; };

  if (loading) return <div className="spinner-container"><div className="spinner" /></div>;
  if (!note) return null;

  return (
    <div className="note-detail">
      <div className="note-detail-header">
        <h1 className="note-detail-title">{note.title}</h1>
        <div className="note-detail-meta">
          <span>Created: {formatDate(note.createdAt)}</span>
          <span>Updated: {formatDate(note.updatedAt)}</span>
          {note.pinned && <span style={{ color: 'var(--secondary)' }}>Pinned</span>}
        </div>
        {note.tags && note.tags.length > 0 && (
          <div className="note-card-tags" style={{ marginTop: 12 }}>
            {note.tags.map((tag, i) => <span key={i} className="tag">{tag}</span>)}
          </div>
        )}
      </div>

      <div className="note-detail-content">{note.content}</div>

      {note.attachmentId && (
        <div className="attachment-preview">
          <div className="attachment-info">
            <div className="attachment-name">{note.attachmentName}</div>
            <div className="attachment-size">{formatSize(note.attachmentSize)}</div>
          </div>
          <div className="attachment-actions">
            <a href={`${API_BASE_URL}/api/files/${note.attachmentId}/download`} className="btn btn-secondary btn-sm" download>Download</a>
            <button className="btn btn-danger btn-sm" onClick={handleDeleteAttachment}>Remove</button>
          </div>
        </div>
      )}

      <div className="form-group">
        <label className="form-label">Upload Attachment (max 20MB)</label>
        <input type="file" onChange={handleFileUpload} accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg" style={{ fontSize: '0.9rem' }} />
      </div>

      <div className="note-detail-actions">
        <Link to={`/notes/${id}/edit`} className="btn btn-primary">Edit</Link>
        <button className="btn btn-secondary" onClick={handlePin}>{note.pinned ? 'Unpin' : 'Pin'}</button>
        <button className="btn btn-secondary" onClick={handleArchive}>Archive</button>
        <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>Back</button>
      </div>
    </div>
  );
}