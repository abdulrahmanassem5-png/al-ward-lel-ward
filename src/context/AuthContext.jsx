import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const DEFAULT_ADMIN = {
  id: 'admin-1',
  email: 'admin@alward.com',
  name: 'أحمد السعيد',
  role: 'admin',
  avatar: '🌹',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('alward_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('alward_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('alward_auth_user');
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    // Simulate brief network delay
    await new Promise((res) => setTimeout(res, 350));
    setLoading(false);

    const savedPass = localStorage.getItem('alward_admin_password') || 'ward2026';
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (cleanEmail === 'admin@alward.com' && cleanPass === savedPass) {
      const authUser = {
        id: 'admin-1',
        email: 'admin@alward.com',
        name: 'أحمد السعيد (مدير المتجر)',
        role: 'admin',
        avatar: '🌹',
      };
      setUser(authUser);
      localStorage.setItem('alward_auth_user', JSON.stringify(authUser));
      return { success: true, user: authUser };
    } else {
      throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }
  };

  const changePassword = (currentPassword, newPassword) => {
    const savedPass = localStorage.getItem('alward_admin_password') || 'ward2026';
    if (currentPassword !== savedPass) {
      throw new Error('كلمة المرور الحالية غير صحيحة');
    }
    if (!newPassword || newPassword.trim().length < 4) {
      throw new Error('يجب ألا تقل كلمة المرور الجديدة عن 4 أحرف أو أرقام');
    }
    localStorage.setItem('alward_admin_password', newPassword.trim());
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('alward_auth_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        changePassword,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
