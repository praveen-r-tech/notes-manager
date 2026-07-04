import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotes } from '../context/NoteContext';
import { useToast } from '../context/ToastContext';

export default function CreateNote() {
  const navigate = useNavigate();
  const { createNote } = useNotes();
  const toast = useToast();
  const [formData, setFormData] = useState({ title: '', content: '', tags: '' });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
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
      const note = await createNote({ title: formData.title.trim(), content: formData.content.trim(), tags });
      toast.success('Note created successfully');
      navigate(`/notes/${note.id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create note');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <div className="page-header">
        <div><h1 className="page-title">Create Note</h1><p className="page-subtitle">Add a new note</p></div>
      </div>
      <form onSubmit={handleSubmit} style={{ background: 'var(--white)', padding: 24, borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)' }}>
        <div className="form-group">
          <label className="form-label">Title *</label>
          <input className="form-input" name="title" value={formData.title} onChange={handleChange} placeholder="Enter note title" />
          {errors.title && <div className="form-error">{errors.title}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Content *</label>
          <textarea className="form-textarea" name="content" value={formData.content} onChange={handleChange} placeholder="Write your note content here..." />
          {errors.content && <div className="form-error">{errors.content}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Tags (comma-separated)</label>
          <input className="form-input" name="tags" value={formData.tags} onChange={handleChange} placeholder="e.g. work, personal, ideas" />
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create Note'}
          </button>
        </div>
      </form>
    </div>
  );
}