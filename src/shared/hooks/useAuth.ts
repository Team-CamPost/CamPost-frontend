import { useCallback, useEffect, useMemo, useState } from "react";

const ACCESS_TOKEN_KEY = "campost.access-token";
const AUTH_CHANGED_EVENT = "campost-auth-changed";

function hasAccessToken() {
  return Boolean(localStorage.getItem(ACCESS_TOKEN_KEY));
}

function notifyAuthChanged() {
  window.dispatchEvent(new CustomEvent(AUTH_CHANGED_EVENT));
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(hasAccessToken);

  useEffect(() => {
    const sync = () => setIsAuthenticated(hasAccessToken());

    window.addEventListener("storage", sync);
    window.addEventListener(AUTH_CHANGED_EVENT, sync as EventListener);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(AUTH_CHANGED_EVENT, sync as EventListener);
    };
  }, []);

  const login = useCallback(() => {
    localStorage.setItem(ACCESS_TOKEN_KEY, "demo-token");
    notifyAuthChanged();
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    notifyAuthChanged();
  }, []);

  return useMemo(
    () => ({ isAuthenticated, login, logout }),
    [isAuthenticated, login, logout],
  );
}
