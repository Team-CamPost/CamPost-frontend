import { useCallback, useEffect, useMemo, useState } from "react";

const ACCESS_TOKEN_KEY = "campost.access-token";
const USER_NAME_KEY = "campost.user-name";
const AUTH_CHANGED_EVENT = "campost-auth-changed";

const hasAccessToken = () => Boolean(localStorage.getItem(ACCESS_TOKEN_KEY));
const getStoredName = () => localStorage.getItem(USER_NAME_KEY) ?? "";

const notifyAuthChanged = () =>
  window.dispatchEvent(new CustomEvent(AUTH_CHANGED_EVENT));

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(hasAccessToken);
  const [userName, setUserName] = useState(getStoredName);

  useEffect(() => {
    const sync = () => {
      setIsAuthenticated(hasAccessToken());
      setUserName(getStoredName());
    };

    window.addEventListener("storage", sync);
    window.addEventListener(AUTH_CHANGED_EVENT, sync as EventListener);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(AUTH_CHANGED_EVENT, sync as EventListener);
    };
  }, []);

  const login = useCallback((token: string, name: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    localStorage.setItem(USER_NAME_KEY, name);
    notifyAuthChanged();
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(USER_NAME_KEY);
    notifyAuthChanged();
  }, []);

  return useMemo(
    () => ({ isAuthenticated, userName, login, logout }),
    [isAuthenticated, userName, login, logout],
  );
};
