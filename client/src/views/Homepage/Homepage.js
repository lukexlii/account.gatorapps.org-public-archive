import Header from '../../components/Header/Header';
import Login from '../Login/Login';
import useAuth from '../../hooks/useAuth';
import './Homepage.css';

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
      <div style={{height: '1000px'}}></div>
    </div>
  );
}

export default Homepage;
