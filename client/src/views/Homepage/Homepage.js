import { Fragment, useState } from 'react';
import Header from '../../components/Header/Header';
import Login from '../Login/Login';
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
          <Login />
        </Fragment>
      )}
      <div></div>
    </div>
  );
}

export default Homepage;
