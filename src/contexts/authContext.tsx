import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

type AuthContextType = {
  user: UserTypes | null;
  login: (values: LoginFormValTypes) => Promise<void>;
  register: (values: RegisterFormValTypes) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
});

const serverUrl = process.env.SERVER_URL || "http://localhost:3001";

const AuthContextProvider = ({ children }: { children: JSX.Element }) => {
  const [user, setUser] = useState<UserTypes | null>(null);

  const getUser = async () => {
    try {
      const authToken =
        localStorage.getItem("auth-token") ||
        sessionStorage.getItem("auth-token");

      if (authToken) {
        const res = await axios.post(
          `${serverUrl}/api/auth/get-user`,
          { authToken },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (res.data.user) {
          setUser(res.data.user);
        }
      }
    } catch (error) {
      console.log(error);
      alert(error instanceof Error && error.message);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const login = async (values: LoginFormValTypes) => {
    try {
      const { email, password, rememberMe } = values;

      const res = await axios.post(
        `${serverUrl}/api/auth/login`,
        { email, password, rememberMe },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200) {
        setUser(res.data.user);

        // Set token
        const token = res.data.authToken;
        if (rememberMe) {
          localStorage.setItem("auth-token", token);
        } else {
          sessionStorage.setItem("auth-token", token);
        }
      }
    } catch (error) {
      const errorMsg = error instanceof Error && error.message;
      console.log(error);
      alert(errorMsg);
    }
  };

  const register = async (values: RegisterFormValTypes) => {
    try {
      const { email, password, rememberMe, fullName } = values;

      const res = await axios.post(
        `${serverUrl}/api/auth/register`,
        { email, password, rememberMe, fullName },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 201) {
        setUser(res.data.user);

        // Set token
        const token = res.data.authToken;
        if (rememberMe) {
          localStorage.setItem("auth-token", token);
        } else {
          sessionStorage.setItem("auth-token", token);
        }
      }
    } catch (error) {
      const errorMsg = error instanceof Error && error.message;
      console.log(error);
      alert(errorMsg);
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      localStorage.removeItem("auth-token");
      sessionStorage.removeItem("auth-token");
    } catch (error) {
      const errorMsg = error instanceof Error && error.message;
      console.log(error);
      alert(errorMsg);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
export const useAuth = () => useContext(AuthContext);
