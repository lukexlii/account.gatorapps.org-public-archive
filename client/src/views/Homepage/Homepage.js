import React from 'react';
import { Header } from '../../components/Header/Header.js';
import './Homepage.css';

class Homepage extends React.Component {
  render() {
    return (
      <div className="Homepage">
        <Header />
        <div>Homepage</div>
      </div>
    );
  }
}

export default Homepage;
