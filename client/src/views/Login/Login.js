import React from 'react';
import { Header } from '../../components/Header/Header.js';
import './Login.css';

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

}

class Login extends React.Component {
  render() {
    return (
      <div className="login">
        <Header />
        <div className="login__body">
          <div className="login__window">
            <div className="login__window_title">
              Students, Faculty & Staff
            </div>
            <button className="login__window_button" onClick={UFLoginViaGoogle}>
              <svg className="login__window_button_logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 43.5 29.4" height="32" width="32" alt="U F Logo"><g fill="#FFF"><path d="M31.1 24.2v-7.5h6.8v-4.9h-6.8V4.9h7.5v2.7h4.9V0H23.7v4.9h1.8v19.3h-1.8v4.9h9.1v-4.9h-1.7zM21.1 18.1V4.9h1.8V0h-9.2v4.9h1.8v11.6c0 4.9-.6 7.2-4 7.2s-4-2.3-4-7.2V4.9h1.8V0H0v4.9h1.8v13.2c0 2.9 0 5.3 1.4 7.4 1.5 2.4 4.3 3.9 8.3 3.9 7.1 0 9.6-3.7 9.6-11.3z"></path></g></svg>
              <div className="login__window_button_text">Log in with GatorLink</div>
            </button>
            <hr style={{ width: '67%', 'margin-top': '10px', 'margin-bottom': '20px'}}></hr>
            <div className="login__window_title">
              Alumni & Friends
            </div>
            <div className="login__window_text">
              Coming soon...
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
