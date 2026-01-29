import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { History } from './pages/History';
import { RecordDetail } from './pages/RecordDetail';
import { Profile } from './pages/Profile';
import Schedules from './pages/Schedules';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { ProfileHeader } from './components/ProfileHeader';
import { Navigation } from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { useProfile } from './hooks/useProfile';

function AppContent() {
  const { profile } = useProfile();

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <>
                <ProfileHeader profile={profile} />
                <main className="pb-16">
                  <Home />
                </main>
                <Navigation />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <>
                <ProfileHeader profile={profile} />
                <main className="pb-16">
                  <History />
                </main>
                <Navigation />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/history/:id"
          element={
            <ProtectedRoute>
              <>
                <ProfileHeader profile={profile} />
                <main className="pb-16">
                  <RecordDetail />
                </main>
                <Navigation />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <>
                <ProfileHeader profile={profile} />
                <main className="pb-16">
                  <Profile />
                </main>
                <Navigation />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/schedules"
          element={
            <ProtectedRoute>
              <>
                <ProfileHeader profile={profile} />
                <main className="pb-16">
                  <Schedules />
                </main>
                <Navigation />
              </>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
