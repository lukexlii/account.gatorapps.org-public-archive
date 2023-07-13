import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../../components/Header/Header';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import axios from '../../../apis/backend';
import AuthContext from '../../../context/AuthProvider';

// Google OAuth: https://developers.google.com/identity/protocols/oauth2
// Potential TODO: New API https://developers.google.com/identity/gsi/web/reference/js-reference
export default function UFGoogleCallback({  }) {
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);

  const HandleGoogleCallback = () => {
    // Potential TODO: frontend HD validation
    const allowedHDs = ['ufl.edu'];
    const url = new URL(window.location.href);
    const hashParams = new URLSearchParams(url.hash.substr(1)); // Exclude the '#' character
    const accessToken = hashParams.get('access_token');
    //window.history.replaceState({}, document.title, '../..');

    if (accessToken) {
      // JUST FOR DEV, REMOVE FOR PROD
      console.log(accessToken);
      handleLoginSuccess(accessToken);
    } else if (hashParams.get('error')) {

    } else {
      handleLoginFailure("");
    }
  };

  const handleLoginSuccess = (access_token) => {
    // Send access token to backend
    axios
      .post('/account/login/ufgoogle', { access_token }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      })
      .then((response) => {
        console.log(response?.data);
        const accessToken = response?.data?.accessToken;
        const email = response?.data?.email;
        const firstName = response?.data?.firstName;
        const lastName = response?.data?.lastName;
        setAuth({ accessToken, email, firstName, lastName });
        navigate('/');
      })
      .catch((error) => {
        setErrorMessage("handleLoginFailure");
      });
  };

  const handleLoginFailure = (error) => {
    setErrorMessage("handleLoginFailure");
  };

  useEffect(HandleGoogleCallback, []);

  return (
    <div>
      <Header />
      {errorMessage ? (
        <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        This is an error alert — <strong>check it out!</strong>
        </Alert>
      ) : (
        <Box sx={{ display: 'flex' }}>
          <CircularProgress />
          <div>Logging you in...</div>
        </Box>
      )}
    </div>
  );
};
