import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { refreshAccessToken } from "../api/auth.api.js"
const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] =
    useState(null);

  // =========================
  // LOAD AUTH FROM STORAGE
  // =========================

  useEffect(() => {

    try {

      const storedUser =
        localStorage.getItem("user");

      const storedToken =
        localStorage.getItem("token");

      const storedRefreshToken =
        localStorage.getItem("refreshToken");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      if (storedToken) {
        setToken(storedToken);
      }

      if (storedRefreshToken) {
        setRefreshToken(storedRefreshToken);
      }
      

    } catch (error) {

      console.error(
        "Failed to restore auth state",
        error
      );

      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    }
    
  }, []);


    const checkAuth = async () => {

            try {

              const token =
                localStorage.getItem("token");

              if (!token) {
              setLoading(false);
              return;
            }

          const res =
            await getCurrentUser();

          setIsAuthenticated(true);

          setIsAdmin(
            res.data.data.roles.includes("admin")
          );

        } catch (error) {

          localStorage.removeItem("token");

          setIsAuthenticated(false);

          setIsAdmin(false);

        } finally {

          setLoading(false);

        }

        };
  // =========================
  // LOGIN
  // =========================

  const login = (authData) => {

    const {
      token,
      refreshToken,
      user,
    } = authData;

    localStorage.setItem(
      "token",
      token
    );

    localStorage.setItem(
      "refreshToken",
      refreshToken
    );

    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );

    // UPDATE STATE IMMEDIATELY
    setUser(user);

    setToken(token);

    setRefreshToken(refreshToken);
  };

  // get Access Token
  const getNewAccessToken = async () => {

    try {

      const refreshToken =
        localStorage.getItem("refreshToken");

      if (!refreshToken) {
        return;
      }

      const payload = { refreshToken };

      const res = await refreshAccessToken(payload);
      console.log(res.data)
      const data = res.data.data;

      // Store new access token
      localStorage.setItem(
        "token",
        data.accessToken
      );

      // Optional if backend returns new refresh token
      if (data.refreshToken) {
        localStorage.setItem(
          "refreshToken",
          data.refreshToken
        );
      }

      // Update user if needed
      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      login(data);

    } catch (error) {

      console.log(
        "Refresh token failed:",
        error
      );

      localStorage.clear();

      window.location.href = "/login";

    }

  };

  // =========================
  // LOGOUT
  // =========================

  const logout = () => {

    localStorage.removeItem("user");

    localStorage.removeItem("token");

    localStorage.removeItem(
      "refreshToken"
    );

    setUser(null);

    setToken(null);

    setRefreshToken(null);

  };

  return (
    <AuthContext.Provider
      value={{
        user: user,
        token,
        refreshToken,
        loading,
        setUser,
        setToken,
        setRefreshToken,
        getNewAccessToken,
        login,
        logout,
        setLoading,
        isAuthenticated: !!user,

        isAdmin: 
          user?.roles?.includes("admin"),

        isCustomer:
          user?.roles?.includes("customer") ||
          user?.role === "customer",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {

  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return context;
}