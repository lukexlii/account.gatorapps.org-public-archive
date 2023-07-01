import React from 'react';
import { Header } from '../../../components/Header/Header.js';
import './UFGoogleCallback.css';
import axios from 'axios';

// Google OAuth: https://developers.google.com/identity/protocols/oauth2
// Potential TODO: New API https://developers.google.com/identity/gsi/web/reference/js-reference
export default function UFGoogleCallback({  }) {
  const HandleGoogleCallback = () => {
    // Potential TODO: frontend HD validation
    const allowedHDs = ['ufl.edu'];
    const url = new URL(window.location.href);
    const hashParams = new URLSearchParams(url.hash.substr(1)); // Exclude the '#' character
    const accessToken = hashParams.get('access_token');
    window.history.replaceState({}, document.title, '../../login');

    if (accessToken) {
      // JUST FOR DEV, REMOVE FOR PROD
      console.log(accessToken);
      handleLoginSuccess(accessToken);
    } else if (hashParams.get('error')) {

    } else {
      handleLoginFailure("");
    }
  };

  const handleLoginSuccess = (access_token) => {
    // Send access token to backend
    axios
      .post(process.env.REACT_APP_SERVER_HOST + '/account/login/ufgoogle', { access_token }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      })
      .then((response) => {
        const email = response.data.email;
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleLoginFailure = (error) => {
    console.log("handleLoginFailure");
  };

  HandleGoogleCallback();

  return (
    <div className="login">
      <Header />
    </div>
  );
};
