import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--primary)' }}>
          📝 NotesManager
        </h2>
      </div>
      <ul className="sidebar-nav">
        <li>
          <NavLink to="/" end>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
            </svg>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/notes" end>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" />
            </svg>
            All Notes
          </NavLink>
        </li>
        <li>
          <NavLink to="/notes/new">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Create Note
          </NavLink>
        </li>
        <li>
          <NavLink to="/pinned">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Pinned Notes
          </NavLink>
        </li>
        <li>
          <NavLink to="/archived">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 8v13H3V8M1 3h22v5H1zM10 12h4" />
            </svg>
            Archived Notes
          </NavLink>
        </li>
      </ul>
    </aside>
  );
}