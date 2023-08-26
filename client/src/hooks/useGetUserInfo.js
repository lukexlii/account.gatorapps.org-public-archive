import { useDispatch } from 'react-redux';
import { setUserInfo } from '../context/authSlice';
import { axiosIdP } from '../apis/backend';

const useGetUserInfo = () => {
  const dispatch = useDispatch();

  const refresh = async () => {
    const response = await axiosIdP.get('/userAuth/getUserInfo', {
      headers: { GATORAPPS_userInfoScope: JSON.stringify(['roles', 'nickname', 'firstName', 'lastName', 'primaryEmail']) }
    });
    dispatch(setUserInfo(response?.data?.userInfo));
    return;
  };

  return refresh;
};

export default useGetUserInfo;