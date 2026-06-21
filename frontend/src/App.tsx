import { useState, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NormalUserDashboard from './pages/NormalUserDashboard';
import StoreOwnerDashboard from './pages/StoreOwnerDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Basic Auth Context
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

function App() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Protected Route Wrapper
  const ProtectedRoute = ({ children, allowedRoles }: { children: JSX.Element, allowedRoles: string[] }) => {
    if (!user) return <Navigate to="/login" />;
    if (!allowedRoles.includes(user.role)) {
      return <div>Access Denied. You do not have permission to view this page.</div>;
    }
    return children;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 text-gray-900">
           {user && (
            <nav className="bg-white shadow">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                  <div className="flex items-center text-xl font-bold">Roxiler Systems</div>
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-700">Hello, {user.name} ({user.role})</span>
                    <button onClick={logout} className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700">Logout</button>
                  </div>
                </div>
              </div>
            </nav>
          )}
          
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<Navigate to={user ? `/${user.role}-dashboard` : "/login"} />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              <Route path="/normal_user-dashboard" element={
                <ProtectedRoute allowedRoles={['normal_user']}>
                  <NormalUserDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/store_owner-dashboard" element={
                <ProtectedRoute allowedRoles={['store_owner']}>
                  <StoreOwnerDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/system_admin-dashboard" element={
                <ProtectedRoute allowedRoles={['system_admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
