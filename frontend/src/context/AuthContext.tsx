import { createContext, ReactNode, useEffect, useState } from "react";
import { apiService } from "../api/ApiService";
import { UserType } from "../api/Types";

interface AuthContextInterface {
  user: UserType | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextInterface>({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  register: async () => {},
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("accessToken")
  );
  const [loading, setLoading] = useState(true);

  const refreshToken = async () => {
    try {
      const res = await apiService.auth.refresh();
      localStorage.setItem("accessToken", res.access);
      setAccessToken(res.access);
    } catch {
      logout();
    }
  };

  useEffect(() => {
    const interval = setInterval(refreshToken, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (accessToken) {
      apiService.user
        .get_user()
        .then((res) => {
          setUser(res);
          setLoading(false);
        })
        .catch(() => {
          logout();
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [accessToken]);

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    const res = await apiService.auth.register(
      email,
      password,
      firstName,
      lastName
    );

    localStorage.setItem("accessToken", res.access);
    setAccessToken(res.access);
    window.location.href = "/";
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await apiService.auth.login(email, password);
      localStorage.setItem("accessToken", res.access);
      setAccessToken(res.access);
      window.location.href = "/";
    } catch (error) {
      console.error("Login failed", error);
      throw new Error("Invalid credentials. Please try again.");
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAccessToken(null);
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
