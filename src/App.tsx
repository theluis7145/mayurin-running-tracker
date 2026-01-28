import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { History } from './pages/History';
import { RecordDetail } from './pages/RecordDetail';
import { Profile } from './pages/Profile';
import { ProfileHeader } from './components/ProfileHeader';
import { Navigation } from './components/Navigation';
import { useProfile } from './hooks/useProfile';

function App() {
  const { profile } = useProfile();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <ProfileHeader profile={profile} />
        <main className="pb-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/history" element={<History />} />
            <Route path="/history/:id" element={<RecordDetail />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
        <Navigation />
      </div>
    </Router>
  );
}

export default App;
