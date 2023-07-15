import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useRefreshToken from '../../hooks/useRefreshToken';
import useAuth from '../../hooks/useAuth';

const PersistLogin = () => {
  const [isRefreshing, setIsRefreshing] = useState(true);
  const refresh = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (error) {
        console.log(error);
      } finally {
        setIsRefreshing(false);
      }
    }

    !auth.accessToken ? verifyRefreshToken() : setIsRefreshing(false);
  }, []);

  return (
    <div>
      {isRefreshing
        ? <div>Logging you in...</div>
        : <Outlet />
      }
    </div>
  )
}

export default PersistLogin;