import { axiosIdP } from '../apis/backend';
import useAuth from './useAuth';

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axiosIdP.get('/userAuth/getAccessToken/', {
      headers: { GATORAPPS_app: process.env.REACT_APP_APP_NAME }
    });
    setAuth(prev => {
      return {
        ...prev,
        accessToken: response.data?.accessToken,
        userInfo: response.data?.userInfo
      }
    });
    return response.data.accessToken;
  };

  return refresh;
};

export default useRefreshToken;