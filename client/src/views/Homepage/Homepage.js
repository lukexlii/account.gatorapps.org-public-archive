import { Fragment, useState } from 'react';
import Header from '../../components/Header/Header';
import SignInWindow from '../../components/SignInWindow/SignInWindow';
import Account from '../Account/Account';
import useAuth from '../../hooks/useAuth';
//import './Homepage.css';

const Homepage = () => {
  const { auth } = useAuth();

  return (
    <div className="Homepage">
      {auth?.accessToken ? (
        <Account />
      ) : (
        <Fragment>
          <Header />
          <SignInWindow />
        </Fragment>
      )}
      <div></div>
    </div>
  );
}

export default Homepage;
