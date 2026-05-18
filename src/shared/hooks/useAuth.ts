import { useCallback, useEffect, useMemo, useState } from "react";

const ACCESS_TOKEN_KEY = "campost.access-token";
const USER_NAME_KEY = "campost.user-name";
const USERNAME_KEY = "campost.username";
const AUTH_CHANGED_EVENT = "campost-auth-changed";

const hasAccessToken = () => Boolean(localStorage.getItem(ACCESS_TOKEN_KEY));
const getStoredName = () => localStorage.getItem(USER_NAME_KEY) ?? "";
const getStoredUsername = () => localStorage.getItem(USERNAME_KEY) ?? "";

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
export const getCurrentUsername = () => getStoredUsername();

const notifyAuthChanged = () =>
  window.dispatchEvent(new CustomEvent(AUTH_CHANGED_EVENT));

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(hasAccessToken);
  const [userName, setUserName] = useState(getStoredName);
  const [username, setUsername] = useState(getStoredUsername);

  useEffect(() => {
    const sync = () => {
      setIsAuthenticated(hasAccessToken());
      setUserName(getStoredName());
      setUsername(getStoredUsername());
    };

    window.addEventListener("storage", sync);
    window.addEventListener(AUTH_CHANGED_EVENT, sync as EventListener);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(AUTH_CHANGED_EVENT, sync as EventListener);
    };
  }, []);

  const login = useCallback(
    (token: string, name: string, username?: string) => {
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
      localStorage.setItem(USER_NAME_KEY, name);
      if (username) {
        localStorage.setItem(USERNAME_KEY, username);
      }
      notifyAuthChanged();
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(USER_NAME_KEY);
    localStorage.removeItem(USERNAME_KEY);
    notifyAuthChanged();
  }, []);

  return useMemo(
    () => ({ isAuthenticated, userName, username, login, logout }),
    [isAuthenticated, userName, username, login, logout],
  );
};
