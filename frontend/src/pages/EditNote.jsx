import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNotes } from '../context/NoteContext';
import { useToast } from '../context/ToastContext';
import NoteService from '../services/noteService';

export default function EditNote() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateNote } = useNotes();
  const toast = useToast();
  const [formData, setFormData] = useState({ title: '', content: '', tags: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [file, setFile] = useState(null);

  useEffect(() => { loadNote(); }, [id]);

  const loadNote = async () => {
    try {
      const res = await NoteService.getNoteById(id);
      const note = res.data;
      setFormData({ title: note.title, content: note.content, tags: note.tags ? note.tags.join(', ') : '' });
    } catch { toast.error('Note not found'); navigate('/notes'); }
    finally { setLoading(false); }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    setFile(selected || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    else if (formData.title.trim().length < 3) newErrors.title = 'Title must be at least 3 characters';
    if (!formData.content.trim()) newErrors.content = 'Content is required';
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setSubmitting(true);
    try {
      const tags = formData.tags ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean) : [];
      await updateNote(id, { title: formData.title.trim(), content: formData.content.trim(), tags });
      if (file) {
          try {
            await NoteService.uploadAttachment(id, file);
            toast.success('Note updated and file uploaded');
          } catch (uploadErr) {
            toast.error('Note updated, but file upload failed');
          }
      } else {
        toast.success('Note updated successfully');
      }
      navigate(`/notes/${id}`);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to update note'); }
    finally { setSubmitting(false); }
  };

  if (loading) return <div className="spinner-container"><div className="spinner" /></div>;

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <div className="page-header">
        <div><h1 className="page-title">Edit Note</h1><p className="page-subtitle">Update your note</p></div>
      </div>
      <form onSubmit={handleSubmit} style={{ background: 'var(--white)', padding: 24, borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)' }}>
        <div className="form-group">
          <label className="form-label">Title *</label>
          <input className="form-input" name="title" value={formData.title} onChange={handleChange} />
          {errors.title && <div className="form-error">{errors.title}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Content *</label>
          <textarea className="form-textarea" name="content" value={formData.content} onChange={handleChange} />
          {errors.content && <div className="form-error">{errors.content}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Tags (comma-separated)</label>
          <input className="form-input" name="tags" value={formData.tags} onChange={handleChange} placeholder="e.g. work, personal, ideas" />
        </div>
        <div className="form-group">
          <label className="form-label">Attachment (replace existing)</label>
          <input type="file" className="form-input" onChange={handleFileChange} />
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}