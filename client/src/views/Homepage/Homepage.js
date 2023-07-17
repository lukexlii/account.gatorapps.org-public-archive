import Header from '../../components/Header/Header';
import Login from '../Login/Login';
import useAuth from '../../hooks/useAuth';
import './Homepage.css';

const Homepage = () => {
  const { auth } = useAuth();

  const UFLoginViaGoogle = () => {
    const params = {
      'client_id': process.env.REACT_APP_GOOGLE_CLIENT_ID,
      // TO FIX: auto get host
      'redirect_uri': 'http://localhost:3000/login/ufgoogle/callback',
      'response_type': 'token',
      'scope': ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'].join(' '),
      'include_granted_scopes': 'true',
      'state': 'pass-through value',
      'hd': 'ufl.edu'
    };
  
    let url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  
    for (const p in params) {
      url.searchParams.set(p, params[p]);
    }
    
    window.location.replace(url);
  };

  const loginMenuItems = [
    { name: "Students, Faculty & Staff" },
    { name: "Log in with GatorLink", 'action': UFLoginViaGoogle},
    { name: "Alumni & Friends" },
    { name: "Coming soon...", 'action': () => window.alert("Coming soon...")}
  ];

  return (
    <div className="homepage">
      <Header loggedIn={auth?.accessToken} loginMenuItems={loginMenuItems}/>
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
