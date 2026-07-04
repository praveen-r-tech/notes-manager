import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NoteProvider } from './context/NoteContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import AllNotes from './pages/AllNotes';
import CreateNote from './pages/CreateNote';
import EditNote from './pages/EditNote';
import ViewNote from './pages/ViewNote';
import PinnedNotes from './pages/PinnedNotes';
import ArchivedNotes from './pages/ArchivedNotes';
import SearchResults from './pages/SearchResults';
import Toast from './components/Toast';
import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <Router>
      <ToastProvider>
        <NoteProvider>
          <div className="app-layout">
            <Sidebar />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Navbar />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/notes" element={<AllNotes />} />
                  <Route path="/notes/new" element={<CreateNote />} />
                  <Route path="/notes/:id/edit" element={<EditNote />} />
                  <Route path="/notes/:id" element={<ViewNote />} />
                  <Route path="/pinned" element={<PinnedNotes />} />
                  <Route path="/archived" element={<ArchivedNotes />} />
                  <Route path="/search" element={<SearchResults />} />
                </Routes>
              </main>
            </div>
          </div>
          <Toast />
        </NoteProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;