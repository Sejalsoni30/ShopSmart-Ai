import { createContext, useState, useContext, useEffect } from 'react';
import { API_URL } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  
  // Try to load from session storage on mount
  useEffect(() => {
    const savedUser = sessionStorage.getItem('shopSmartUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (email, password) => {
    // Mock login logic
    const mockUser = {
      id: "usr-123",
      name: email.split('@')[0],
      email: email,
      avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=7c3aed&color=fff`
    };
    setUser(mockUser);
    sessionStorage.setItem('shopSmartUser', JSON.stringify(mockUser));
    return true; // success
  };

  const googleLogin = async (credentialResponse) => {
    try {
      const res = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential })
      });
      if (!res.ok) throw new Error('Google Login Failed');
      const userData = await res.json();
      
      setUser(userData);
      sessionStorage.setItem('shopSmartUser', JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('shopSmartUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
