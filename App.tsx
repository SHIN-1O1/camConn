import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import AuthPage from './pages/AuthPage';
import FeedPage from './pages/FeedPage';
import UploadPage from './pages/UploadPage';
import ProfilePage from './pages/ProfilePage';
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <HashRouter>
      {user && <Header />}
      <main className="container mx-auto max-w-3xl p-4 mt-16">
        <Routes>
          <Route 
            path="/" 
            element={user ? <FeedPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/login" 
            element={!user ? <AuthPage /> : <Navigate to="/" />} 
          />
          <Route 
            path="/upload" 
            element={user ? <UploadPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/profile/:userId" 
            element={user ? <ProfilePage /> : <Navigate to="/login" />} 
          />
        </Routes>
      </main>
    </HashRouter>
  );
};

export default App;
