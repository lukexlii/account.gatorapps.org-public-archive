import { useSelector, useDispatch } from 'react-redux';
import { setUserInfo } from '../context/authSlice';
import { axiosIdP } from '../apis/backend';

const useRefreshToken = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const dispatch = useDispatch();

  const refresh = async () => {
    const response = await axiosIdP.get('/userAuth/getUserInfo', {
      headers: { GATORAPPS_userInfoScope: JSON.stringify(['roles', 'nickName', 'firstName', 'lastName', 'primaryEmail']) }
    });
    dispatch(setUserInfo(response?.data?.userInfo));
    return;
  };

  return refresh;
};

export default useRefreshToken;