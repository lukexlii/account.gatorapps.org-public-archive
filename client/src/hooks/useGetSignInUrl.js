import { axiosPrivate } from '../apis/backend';

const useUfGoogle = async () => {
  axiosPrivate.post(`/userAuth/signIn/initialize/ufgoogle?continueTo=${window.location.href}`)
    .then((response) => {
      if (response?.data?.errCode === '0' && response?.data?.payload) window.location.href = response.data.payload;
    })
    .catch((error) => {
    })
}

export { useUfGoogle };