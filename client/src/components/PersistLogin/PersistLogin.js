import { Outlet } from 'react-router-dom';
import { Fragment, useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
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
        ? <Fragment><Header loading /><div>Logging you in...</div></Fragment>
        : <Outlet />
      }
    </div>
  )
}

export default PersistLogin;