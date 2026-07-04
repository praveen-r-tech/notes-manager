import { Link } from 'react-router-dom';
import authService from '../services/authService';

export default function Navbar() {
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard">📝 Notes Manager</Link>
      </div>
      <div className="navbar-menu">
        {authService.isAuthenticated() ? (
          <>
            <span className="navbar-user">Welcome, {user?.username}</span>
            <button onClick={handleLogout} className="btn btn-secondary btn-sm">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
