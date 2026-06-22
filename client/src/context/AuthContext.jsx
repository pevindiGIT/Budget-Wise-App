import { createContext, useContext, useEffect, useState } from "react";
import { getProfile } from "../services/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // Verify stored token on first load
  useEffect(() => {
    async function boot() {
      const token = localStorage.getItem("token");
      if (!token) {
        setReady(true);
        return;
      }
      try {
        const res = await getProfile();
        setUser(res.data.user);
      } catch {
        // Token is invalid or expired — clear it
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setReady(true);
      }
    }
    boot();
  }, []); // runs once on mount only

  const login = ({ token, user }) => {
    localStorage.setItem("token", token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const token = localStorage.getItem("token");

  return (
    <AuthContext.Provider value={{ user, token, login, logout, ready }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
