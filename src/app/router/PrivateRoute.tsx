import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ROUTES } from "./paths";
import { useAuth } from "../../shared/hooks/useAuth";

export const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    const redirectTo = encodeURIComponent(location.pathname + location.search);
    return (
      <Navigate
        to={`${ROUTES.login}?redirectTo=${redirectTo}`}
        replace
      />
    );
  }

  return <Outlet />;
};
