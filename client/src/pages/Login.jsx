import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Mail, Lock, Eye, EyeOff, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import './Login.css';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      setIsLoading(true);
      setTimeout(() => {
        login(email, password);
        navigate('/');
      }, 800); // Simulate network delay for UX
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    const success = await googleLogin(credentialResponse);
    if (success) {
      navigate('/');
    } else {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="login-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="login-container card">
        <div className="login-header text-center">
          <div className="login-logo">
            <ShoppingBag size={40} className="icon-primary" />
          </div>
          <h2>{isLogin ? 'Welcome Back' : 'Create an Account'}</h2>
          <p className="text-muted">
            {isLogin ? 'Sign in to continue to ShopSmart AI' : 'Sign up to start your smart shopping journey'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <Mail className="input-icon" size={18} />
            <input 
              type="email" 
              className="input-field with-icon" 
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          
          <div className="input-group">
            <Lock className="input-icon" size={18} />
            <input 
              type={showPassword ? "text" : "password"} 
              className="input-field with-icon" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
            <button 
              type="button" 
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <button type="submit" className="btn btn-primary login-btn" disabled={isLoading}>
            {isLoading ? <Loader className="spinner" size={18} /> : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div className="login-footer text-center mt-5">
          <p className="text-muted">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button className="text-link" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? ' Sign Up' : ' Sign In'}
            </button>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
