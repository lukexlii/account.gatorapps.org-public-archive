import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

export const Header = (props) => {
  return (
    <div>
      <header className="header">
        <div className="header__left">
          <div className="header__title">
            <svg className="header__title_logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 43.5 29.4" height="32" width="32" alt="U F Logo"><g fill="#FFF"><path d="M31.1 24.2v-7.5h6.8v-4.9h-6.8V4.9h7.5v2.7h4.9V0H23.7v4.9h1.8v19.3h-1.8v4.9h9.1v-4.9h-1.7zM21.1 18.1V4.9h1.8V0h-9.2v4.9h1.8v11.6c0 4.9-.6 7.2-4 7.2s-4-2.3-4-7.2V4.9h1.8V0H0v4.9h1.8v13.2c0 2.9 0 5.3 1.4 7.4 1.5 2.4 4.3 3.9 8.3 3.9 7.1 0 9.6-3.7 9.6-11.3z"></path></g></svg>
            <h1 className="header__title_text">GatorAccount</h1>
          </div>
          <nav className="header__nav">
            <Link className="header__nav_text" to={'/'}>Home</Link>
          </nav>
        </div>
        <div className="header__login">
          <Link className="header__nav_text" to={'/student'}>Student</Link>
        </div>
      </header>
      <div className="header__spaceholder"></div>
    </div>
  );
};
