import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { NoteProvider } from './context/NoteContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';
import Dashboard from './pages/Dashboard';
import AllNotes from './pages/AllNotes';
import CreateNote from './pages/CreateNote';
import EditNote from './pages/EditNote';
import ViewNote from './pages/ViewNote';
import PinnedNotes from './pages/PinnedNotes';
import ArchivedNotes from './pages/ArchivedNotes';
import SearchResults from './pages/SearchResults';
import Login from './pages/Login';
import Register from './pages/Register';
import { isAuthenticated } from './services/authService';
import './styles/index.css';

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <Router>
      <ToastProvider>
        <NoteProvider>
          <div className="app">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<ProtectedRoute><><Navbar /><Sidebar /></></ProtectedRoute>}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="notes" element={<AllNotes />} />
                <Route path="notes/new" element={<CreateNote />} />
                <Route path="notes/:id" element={<ViewNote />} />
                <Route path="notes/:id/edit" element={<EditNote />} />
                <Route path="pinned" element={<PinnedNotes />} />
                <Route path="archived" element={<ArchivedNotes />} />
                <Route path="search" element={<SearchResults />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toast />
          </div>
        </NoteProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;