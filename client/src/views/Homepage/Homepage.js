import React from 'react';
import { useContext } from 'react';
import { Header } from '../../components/Header/Header.js';
import Login from '../Login/Login.js';
import './Homepage.css';
import AuthContext from '../../context/AuthProvider';

const Homepage = () => {
  const { auth } = useContext(AuthContext);
  console.log(auth);

  return (
    <div className="Homepage">
      <Header />
      {auth?.accessToken ? (
        <div>
        <div>Welcome, {auth?.firstName}!</div>
        <div>First name: {auth?.firstName}</div>
        <div>Last name: {auth?.lastName}</div>
        <div>Email: {auth?.email}</div>
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default Homepage;
