import { Fragment, useState } from 'react';
import Header from '../../components/Header/Header';
import SignInWindow from '../../components/SignInWindow/SignInWindow';
import Account from '../Account/Account';
import { useSelector } from 'react-redux';
//import './Homepage.css';

const Homepage = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);

  return (
    <div className="Homepage">
      {userInfo?.roles.includes(100001) ? (
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
