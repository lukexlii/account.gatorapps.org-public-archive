import axios from '../apis/backend';
import useAuth from './useAuth';

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.get('/userAuth/refresh', {
      withCredentials: true
    });
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