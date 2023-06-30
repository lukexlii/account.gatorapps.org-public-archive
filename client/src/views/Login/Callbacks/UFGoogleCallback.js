import React from 'react';
import { Header } from '../../../components/Header/Header.js';
import './UFGoogleCallback.css';

export default function UFGoogleCallback({  }) {
  const HandleGoogleCallback = () => {
    const url = new URL(window.location.href);
    const hashParams = new URLSearchParams(url.hash.substr(1)); // Exclude the '#' character

    const specificParamValue = hashParams.get('access_token');
    console.log(specificParamValue); // Do something with the value

  };

  HandleGoogleCallback();

  return (
    <div className="login">
      <Header />
    </div>
  );
};
