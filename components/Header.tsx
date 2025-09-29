import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useAuth } from '../hooks/useAuth';
import { Home, PlusSquare, User, LogOut, Camera } from 'lucide-react';

const Header: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b z-10">
      <nav className="container mx-auto max-w-3xl p-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-semibold font-serif flex items-center gap-2">
          <Camera className="w-6 h-6 text-purple-600"/>
          CamConn
        </Link>
        {user && (
          <div className="flex items-center space-x-4">
            <Link to="/" aria-label="Home Feed">
              <Home className="w-6 h-6 text-gray-700 hover:text-black transition" />
            </Link>
            <Link to="/upload" aria-label="Upload Post">
              <PlusSquare className="w-6 h-6 text-gray-700 hover:text-black transition" />
            </Link>
            <Link to={`/profile/${user.uid}`} aria-label="My Profile">
              <User className="w-6 h-6 text-gray-700 hover:text-black transition" />
            </Link>
            <button onClick={handleLogout} aria-label="Logout">
              <LogOut className="w-6 h-6 text-red-500 hover:text-red-700 transition" />
            </button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
