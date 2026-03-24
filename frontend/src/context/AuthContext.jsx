import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [activeRole, setActiveRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('hb_token');
    const savedUser = localStorage.getItem('hb_user');
    if (token && savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setIsAuthenticated(true);
      setUser(parsedUser);
      if (parsedUser.roles && parsedUser.roles.length > 0) {
        setActiveRole(parsedUser.roles[0]);
      }
    }
  }, []);

  const login = async (email, password) => {
    const res = await fetch('http://localhost:8000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Login failed');
    }
    
    const data = await res.json();
    setIsAuthenticated(true);
    setUser(data.user);
    const targetRole = data.user.roles[0] || 'donor';
    setActiveRole(targetRole);
    
    localStorage.setItem('hb_token', data.access_token);
    localStorage.setItem('hb_user', JSON.stringify(data.user));
    
    return targetRole;
  };

  const register = async (name, email, password, roles) => {
    const res = await fetch('http://localhost:8000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, roles })
    });
    
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Registration failed');
    }
    
    return await login(email, password);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setActiveRole(null);
    localStorage.removeItem('hb_token');
    localStorage.removeItem('hb_user');
  };

  const switchRole = (newRole) => {
    if (user?.roles.includes(newRole)) {
      setActiveRole(newRole);
      const updatedUser = { ...user, activeRole: newRole };
      setUser(updatedUser);
      localStorage.setItem('hb_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, activeRole, login, register, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
