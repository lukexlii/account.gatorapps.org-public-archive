import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Unauthorized from '../../views/Unauthorized/Unauthorized';

const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useAuth();
    const location = useLocation();

    return (
        auth?.roles?.find(role => allowedRoles?.includes(role))
            ? <Outlet />
            : auth?.accessToken
                ? <Unauthorized />
                : <Navigate to="./" state={{ from: location }} replace />
    );
}

export default RequireAuth;