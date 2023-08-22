import { axiosIdP } from '../apis/backend';
import useAuth from './useAuth';

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axiosIdP.get('/userAuth/getAccessToken/', {
      headers: { GATORAPPS_responseScope: JSON.stringify(['roles', 'nickName', 'firstName', 'lastName', 'primaryEmail']) }
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