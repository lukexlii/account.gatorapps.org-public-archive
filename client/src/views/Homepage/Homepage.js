import { Header } from '../../components/Header/Header.js';
import Login from '../Login/Login.js';
import './Homepage.css';
import useAuth from '../../hooks/useAuth';

const Homepage = () => {
  const { auth } = useAuth();

  return (
    <div className="homepage">
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
