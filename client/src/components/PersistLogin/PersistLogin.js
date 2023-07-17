import { Outlet } from 'react-router-dom';
import { Fragment, useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
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
        ? <Fragment>
            <Header loading />
            <Box align='center' sx={{
              'position': 'fixed',
              'top': '50%',
              'left': '50%',
              'transform': 'translate(-50%, -50%)'
            }}>
              <CircularProgress size="80px" sx={{ color: "rgb(224, 129, 46)" }}/>
            </Box>
          </Fragment>
        : <Outlet />
      }
    </div>
  )
}

export default PersistLogin;