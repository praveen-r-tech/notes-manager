import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import authService from '../services/authService';
import axios from '../services/api';

// ---- Sanitization ----
function sanitize(str) {
  return str.replace(/<[^>]*>/g, '').replace(/[&<>"']/g, '').trim();
}

// ---- Password validation ----
function validatePassword(pw) {
  return {
    minLength: pw.length >= 6,
    hasNumber: /[0-9]/.test(pw),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\;'~`]/.test(pw),
  };
}

const requirementMeta = [
  { key: 'minLength', label: 'At least 6 characters' },
  { key: 'hasNumber', label: 'At least 1 number' },
  { key: 'hasSpecial', label: 'At least 1 special character' },
];

export default function Register() {
  const navigate = useNavigate();
  const toast = useToast();
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [checkingEmail, setCheckingEmail] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error when user types
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: sanitize(value) }));
  };

  const checkEmailExists = async (email) => {
    if (!email.includes('@') || fieldErrors.email === 'Checking...') return;
    setCheckingEmail(true);
    setFieldErrors((prev) => ({ ...prev, email: 'Checking...' }));
    try {
      // Simple backend check - if user exists by email
      await axios.get(`/auth/check-email?email=${encodeURIComponent(email)}`);
      setFieldErrors((prev) => ({ ...prev, email: '' }));
    } catch (err) {
      if (err.response?.status === 409) {
        setFieldErrors((prev) => ({ ...prev, email: 'An account with this email already exists' }));
      } else {
        setFieldErrors((prev) => ({ ...prev, email: '' }));
      }
    } finally {
      setCheckingEmail(false);
    }
  };

  const pwChecks = validatePassword(formData.password);
  const allMet = Object.values(pwChecks).every(Boolean)
    && formData.username.trim().length >= 3
    && formData.email.includes('@')
    && !fieldErrors.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!allMet) return;

    // Final check before submit
    if (fieldErrors.email === 'Checking...') return;

    setLoading(true);
    try {
      await authService.register({
        username: sanitize(formData.username),
        email: sanitize(formData.email),
        password: formData.password,
      });
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      // Show inline if email-specific error
      if (msg.toLowerCase().includes('email already exists')) {
        setFieldErrors((prev) => ({ ...prev, email: 'An account with this email already exists' }));
      } else if (msg.toLowerCase().includes('username already exists')) {
        setFieldErrors((prev) => ({ ...prev, username: 'This username is already taken' }));
      } else {
        toast.error(msg);
      }
    } finally { setLoading(false); }
  };

  const handleGoogleRegister = () => {
    toast.info('Google registration coming soon!');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-sidebar">
          <div className="auth-brand">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </div>
          <h2>Notes Manager</h2>
          <p>Your ideas, organized.</p>
          <div className="auth-features">
            <div className="auth-feature">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
              <span>Rich note editor</span>
            </div>
            <div className="auth-feature">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
              <span>File attachments</span>
            </div>
            <div className="auth-feature">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
              <span>Pin favorites</span>
            </div>
            <div className="auth-feature">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              <span>Quick search</span>
            </div>
          </div>
        </div>
        <div className="auth-form-wrapper">
          <div className="auth-form-container">
            <div className="auth-header">
              <h1>Create account</h1>
              <p>Start organizing your notes</p>
            </div>

            <button className="btn-google" onClick={handleGoogleRegister} type="button">
              <svg width="20" height="20" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
                <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
              </svg>
              <span>Sign up with Google</span>
            </button>

            <div className="auth-divider">
              <span>or sign up with email</span>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label className="form-label">Username</label>
                <div className="input-with-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                  <input type="text" name="username" className="form-input" placeholder="Choose a username" value={formData.username} onChange={handleChange} onBlur={handleBlur} required minLength={3} maxLength={50} />
                </div>
                {fieldErrors.username && <span className="form-error">{fieldErrors.username}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <div className="input-with-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                  <input type="email" name="email" className="form-input" placeholder="Enter your email" value={formData.email} onChange={handleChange} onBlur={(e) => { handleBlur(e); if (e.target.value.includes('@')) checkEmailExists(e.target.value); }} required />
                </div>
                {fieldErrors.email && fieldErrors.email !== 'Checking...' && <span className="form-error">{fieldErrors.email}</span>}
                {fieldErrors.email === 'Checking...' && <span className="form-error" style={{ color: 'var(--gray-400)' }}>Checking...</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-with-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                  <input type={showPassword ? "text" : "password"} name="password" className="form-input" placeholder="Create a password" value={formData.password} onChange={handleChange} required minLength={6} />
                  <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                    )}
                  </button>
                </div>
                {formData.password.length > 0 && (
                  <ul className="password-requirements">
                    {requirementMeta.map(({ key, label }) => {
                      const met = pwChecks[key];
                      return (
                        <li key={key} className={met ? 'met' : 'unmet'}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            {met ? (
                              <polyline points="20 6 9 17 4 12" />
                            ) : (
                              <>
                                <circle cx="12" cy="12" r="10" />
                                <line x1="15" y1="9" x2="9" y2="15" />
                                <line x1="9" y1="9" x2="15" y2="15" />
                              </>
                            )}
                          </svg>
                          {label}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
              <button type="submit" className="btn btn-primary btn-block" disabled={loading || !allMet}>
                {loading ? (
                  <span className="btn-loading">
                    <span className="btn-spinner"></span>
                    Creating account...
                  </span>
                ) : 'Create Account'}
              </button>
            </form>

            <p className="auth-footer">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}