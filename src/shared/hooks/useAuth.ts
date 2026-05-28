import { useCallback, useEffect, useMemo, useState } from "react";

const ACCESS_TOKEN_KEY = "campost.access-token";
const REFRESH_TOKEN_KEY = "campost.refresh-token";
const USER_NAME_KEY = "campost.user-name";
const USERNAME_KEY = "campost.username";
const USER_ROLE_KEY = "campost.user-role";
const AUTH_CHANGED_EVENT = "campost-auth-changed";

const hasAccessToken = () => Boolean(localStorage.getItem(ACCESS_TOKEN_KEY));
const getStoredName = () => localStorage.getItem(USER_NAME_KEY) ?? "";
const getStoredUsername = () => localStorage.getItem(USERNAME_KEY) ?? "";
const getStoredRole = () => localStorage.getItem(USER_ROLE_KEY) ?? "";

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);
export const getCurrentUsername = () => getStoredUsername();
export const setAccessToken = (token: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  notifyAuthChanged();
};

export const clearAuthStorage = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_NAME_KEY);
  localStorage.removeItem(USERNAME_KEY);
  localStorage.removeItem(USER_ROLE_KEY);
  notifyAuthChanged();
};

const notifyAuthChanged = () =>
  window.dispatchEvent(new CustomEvent(AUTH_CHANGED_EVENT));

type LoginSession = {
  accessToken: string;
  refreshToken: string;
  name: string;
  username?: string;
  role?: string;
};

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(hasAccessToken);
  const [userName, setUserName] = useState(getStoredName);
  const [username, setUsername] = useState(getStoredUsername);
  const [role, setRole] = useState(getStoredRole);

  useEffect(() => {
    const sync = () => {
      setIsAuthenticated(hasAccessToken());
      setUserName(getStoredName());
      setUsername(getStoredUsername());
      setRole(getStoredRole());
    };

    window.addEventListener("storage", sync);
    window.addEventListener(AUTH_CHANGED_EVENT, sync as EventListener);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(AUTH_CHANGED_EVENT, sync as EventListener);
    };
  }, []);

  const login = useCallback(
    ({ accessToken, refreshToken, name, username, role }: LoginSession) => {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      localStorage.setItem(USER_NAME_KEY, name);

      if (username?.trim()) {
        localStorage.setItem(USERNAME_KEY, username);
      }

      if (role?.trim()) {
        localStorage.setItem(USER_ROLE_KEY, role);
      }

      notifyAuthChanged();
    },
    [],
  );

  const logout = useCallback(() => {
    clearAuthStorage();
  }, []);

  return useMemo(
    () => ({ isAuthenticated, userName, username, role, login, logout }),
    [isAuthenticated, userName, username, role, login, logout],
  );
};
