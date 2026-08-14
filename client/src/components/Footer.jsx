import { Link } from 'react-router-dom';
import { ShoppingBag, MessageCircle, Globe, Camera, Hash } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="nav-logo">
              <ShoppingBag className="icon" />
              <span className="text-gradient">ShopSmart AI</span>
            </Link>
            <p className="footer-desc text-muted mt-2">
              Your intelligent shopping companion. Discover, evaluate, and compare products effortlessly with AI.
            </p>
            <div className="social-links mt-4">
              <a href="#" className="social-icon"><MessageCircle size={20} /></a>
              <a href="#" className="social-icon"><Globe size={20} /></a>
              <a href="#" className="social-icon"><Camera size={20} /></a>
              <a href="#" className="social-icon"><Hash size={20} /></a>
            </div>
          </div>
          
          <div className="footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/assistant">AI Assistant</Link></li>
              <li><Link to="/categories">Categories</Link></li>
              <li><Link to="/compare">Compare</Link></li>
            </ul>
          </div>
          
          <div className="footer-links">
            <h3>Legal</h3>
            <ul>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="text-muted">&copy; {new Date().getFullYear()} ShopSmart AI. Built for demo purposes.</p>
        </div>
      </div>
    </footer>
  );
}
