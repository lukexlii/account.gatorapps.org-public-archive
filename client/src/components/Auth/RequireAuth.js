import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Unauthorized from '../../views/Unauthorized/Unauthorized';

const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useAuth();
  const location = useLocation();

  return (
    auth?.userInfo?.roles?.find(role => allowedRoles?.includes(role))
      ? <Outlet />
      : auth?.accessToken
        ? <Unauthorized />
        : <Navigate to="./login" state={{ from: location }} replace />
  );
}

export default RequireAuth;