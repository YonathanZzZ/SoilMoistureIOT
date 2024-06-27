"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface IAuthContext {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<IAuthContext | null>(null);
export default function Auth(props: React.PropsWithChildren) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/users/check-auth", {
      method: "GET",
      credentials: 'include' //include cookies in request (session id cookie)
    }).then((res) => {
      setIsLoading(false);

      if (res.ok) {
        console.log('user validated');
        setIsAuthenticated(true);
      }
    });
  }, []);

  async function login(email: string, password: string) {
    const body = { email: email, password: password };

    const loginResponse = await fetch(
      "http://localhost:8080/users/login/password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include', //required when the response includes a cookie
        body: JSON.stringify(body),
      }
    );

    if (!loginResponse.ok) {
      return false;
    }

    setIsAuthenticated(true);
    return true;
  }

  async function logout() {
    try {
      const logoutResponse = await fetch("http://localhost:8080/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!logoutResponse.ok) {
        throw new Error("logout failed");
      }
    } catch (error) {
    } finally {
      console.log('in finally');
      setIsAuthenticated(false);
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {props.children}
    </AuthContext.Provider>
  );
}
