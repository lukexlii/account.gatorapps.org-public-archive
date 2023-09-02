import { useDispatch } from 'react-redux';
import { setUserInfo } from '../context/authSlice';
import { axiosPrivate } from '../apis/backend';

const useGetUserInfo = () => {
  const dispatch = useDispatch();

  const getUserInfo = async () => {
    await axiosPrivate.get('/userAuth/getUserAuthInfo')
      .then(response => {
        dispatch(setUserInfo(response?.data?.payload));
      })
      .catch(error => {
        if (error?.response?.data?.errCode) dispatch(setUserInfo({ roles: [] }));
      })
  };

  return getUserInfo;
};

export default useGetUserInfo;