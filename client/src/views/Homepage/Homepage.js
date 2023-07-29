import { Fragment, useState } from 'react';
import Header from '../../components/Header/Header';
import LoginWindow from '../../components/Login/LoginWindow';
import Account from '../Account/Account';
import useAuth from '../../hooks/useAuth';
//import './Homepage.css';

const Homepage = () => {
  const { auth } = useAuth();

  return (
    <div className="homepage">
      {auth?.accessToken ? (
        <Account />
      ) : (
        <Fragment>
          <Header />
          <LoginWindow />
        </Fragment>
      )}
      <div></div>
    </div>
  );
}

export default Homepage;
