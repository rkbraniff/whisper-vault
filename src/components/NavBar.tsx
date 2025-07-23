import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NavBar() {
  const { user, logout } = useAuth();
  const initials = user ? ((user.firstName?.[0] || '') + (user.lastName?.[0] || '')).toUpperCase() : '';

  return (
    <nav className="flex gap-4 p-4 bg-gray-800 text-white fixed top-0 left-0 w-full z-50 items-center justify-between">
      <div className="flex gap-4 items-center">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/messenger" className="hover:underline">Messenger</Link>
      </div>
      {user ? (
        <div className="flex items-center gap-2 relative group">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt="avatar"
              className="w-9 h-9 rounded-full object-cover border-2 border-violet-600"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-violet-600 flex items-center justify-center text-lg font-bold cursor-pointer">
              {initials || <span className="text-xs">?</span>}
            </div>
          )}
          <span className="ml-2 font-medium">{user.firstName} {user.lastName}</span>
          <button
            onClick={logout}
            className="ml-4 px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 text-sm"
          >
            Log Out
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Link to="/signup" className="hover:underline">Sign Up</Link>
          <Link to="/signin" className="hover:underline">Sign In</Link>
        </div>
      )}
    </nav>
  );
}
