import axios from '../apis/backend';
import useAuth from './useAuth';

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.get('/account/refresh', {
      withCredentials: true
    });
    setAuth(prev => {
      return { ...prev, accessToken: response.data.accessToken }
    });
    return response.data.accessToken;
  };
  
  return refresh;
};

export default useRefreshToken;