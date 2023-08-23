import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import ErrorPage from '../../views/ErrorPage/ErrorPage';

const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useAuth();
  const location = useLocation();

  return (
    auth?.userInfo?.roles?.find(role => allowedRoles?.includes(role))
      ? <Outlet />
      : auth?.accessToken
        ? <ErrorPage error='403' />
        : <Navigate to="./signin" state={{ from: location }} replace />
  );
};

export default RequireAuth;