import { Outlet } from 'react-router-dom';
import { Fragment, useState, useEffect } from 'react';
import Header from '../Header/Header';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import useGetUserInfo from '../../hooks/useGetUserInfo';
import { useSelector } from 'react-redux';
import useFetchData from '../../hooks/useFetchData';

const InitializeApp = () => {
  const [isRefreshing, setIsRefreshing] = useState(true);
  const refresh = useGetUserInfo();

  const userInfo = useSelector((state) => state.auth.userInfo);

  const { data: userAuthInfoData, loading: userAuthInfoLoading, alert: userAuthInfoAlert, reFetch: userAuthInfoReFetch } = useFetchData('/userAuth/getUserAuthInfo');

  useEffect(() => {
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

export default InitializeApp;