import { useNavigate } from "react-router-dom";
import Unauthorized from '../../views/Unauthorized/Unauthorized';
import { axiosPrivate } from '../../apis/backend';

const UFLoginViaGoogle = () => {
  const params = {
    'client_id': process.env.REACT_APP_GOOGLE_CLIENT_ID,
    // TO FIX: auto get host
    'redirect_uri': 'http://localhost:3000/login/ufgoogle/callback',
    'response_type': 'token',
    'scope': ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'].join(' '),
    'include_granted_scopes': 'true',
    'state': 'pass-through value',
    'hd': 'ufl.edu'
  };

  let url = new URL('https://accounts.google.com/o/oauth2/v2/auth');

  for (const p in params) {
    url.searchParams.set(p, params[p]);
  }
  
  window.location.replace(url);
};

export { UFLoginViaGoogle };