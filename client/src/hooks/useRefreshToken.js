import { axiosIdP } from '../apis/backend';
import useAuth from './useAuth';

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axiosIdP.get('/userAuth/getAccessToken', {
      withCredentials: true
    }, { app: process.env.REACT_APP_APP_NAME });
    setAuth(prev => {
      return {
        ...prev,
        accessToken: response.data.accessToken,
        roles: response.data.roles,
        email: response.data.email,
        firstName: response.data.firstName,
        lastName: response.data.lastName
      }
    });
    return response.data.accessToken;
  };

  return refresh;
};

export default useRefreshToken;