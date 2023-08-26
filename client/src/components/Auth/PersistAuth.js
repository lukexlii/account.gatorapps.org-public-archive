import { Outlet } from 'react-router-dom';
import { Fragment, useState, useEffect } from 'react';
import Header from '../Header/Header';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import useGetUserInfo from '../../hooks/useGetUserInfo';
import { useSelector, useDispatch } from 'react-redux';

const PersistAuth = () => {
  const [isRefreshing, setIsRefreshing] = useState(true);
  const refresh = useGetUserInfo();

  const userInfo = useSelector((state) => state.auth.userInfo);

  useEffect(() => {
    const verifyUserAuth = async () => {
      try {
        await refresh();
      } catch (error) {
        console.log(error);
      } finally {
        setIsRefreshing(false);
      }
    }

    !userInfo?.roles.includes('00001') ? verifyUserAuth() : setIsRefreshing(false);
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
            <CircularProgress size="80px" sx={{ color: "rgb(224, 129, 46)" }} />
          </Box>
        </Fragment>
        : <Outlet />
      }
    </div>
  )
}

export default PersistAuth;