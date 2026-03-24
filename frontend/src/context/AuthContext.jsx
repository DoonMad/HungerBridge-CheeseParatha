import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [activeRole, setActiveRole] = useState(null);

  // Check generic mock login on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('hb_mock_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setIsAuthenticated(true);
      setUser(parsedUser);
      setActiveRole(parsedUser.activeRole);
    }
  }, []);

  const login = (userData, roleToLogin) => {
    const targetRole = roleToLogin || userData.roles[0];
    const userPayload = { ...userData, activeRole: targetRole };
    
    setIsAuthenticated(true);
    setUser(userPayload);
    setActiveRole(targetRole);
    // Mock persistence
    localStorage.setItem('hb_mock_user', JSON.stringify(userPayload));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setActiveRole(null);
    localStorage.removeItem('hb_mock_user');
  };

  const switchRole = (newRole) => {
    if (user?.roles.includes(newRole)) {
      setActiveRole(newRole);
      const updatedUser = { ...user, activeRole: newRole };
      setUser(updatedUser);
      localStorage.setItem('hb_mock_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, activeRole, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
