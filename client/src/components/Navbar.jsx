import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Sparkles, User, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="nav-logo">
          <ShoppingBag className="icon" />
          <span className="text-gradient">ShopSmart AI</span>
        </Link>
        <div className="nav-links">
          <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
          <Link to="/assistant" className={`nav-link ${isActive('/assistant')}`}>
            <Sparkles size={16} /> AI Assistant
          </Link>
          <Link to="/categories" className={`nav-link ${isActive('/categories')}`}>Categories</Link>
          <Link to="/compare" className={`nav-link ${isActive('/compare')}`}>Compare</Link>
          <Link to="/pricing" className={`nav-link ${isActive('/pricing')}`}>Pricing</Link>
          <Link to="/about" className={`nav-link ${isActive('/about')}`}>About</Link>
        </div>
        
        <div className="nav-auth flex items-center gap-4">
          <button onClick={toggleTheme} className="btn-icon" title="Toggle Theme">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {user ? (
            <div className="user-menu">
              <img src={user.avatar} alt="User" className="user-avatar" />
              <span className="user-name">{user.name}</span>
              <button onClick={() => { logout(); navigate('/'); }} className="btn-icon text-muted" title="Log Out">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">Sign In</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
