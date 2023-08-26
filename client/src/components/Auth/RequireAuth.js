import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useSelector } from 'react-redux';
import ErrorPage from '../../views/ErrorPage/ErrorPage';

const RequireAuth = ({ allowedRoles }) => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const location = useLocation();

  return (
    userInfo?.roles?.find(role => allowedRoles?.includes(role))
      ? <Outlet />
      : userInfo?.roles.includes(100001)
        ? <ErrorPage error='403' />
        : <Navigate to="./signin" state={{ from: location }} replace />
  );
};

export default RequireAuth;