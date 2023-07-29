import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/Header/Header';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import axios from '../../../apis/backend';
import AuthContext from '../../../context/AuthProvider';

// Google OAuth: https://developers.google.com/identity/protocols/oauth2
// Potential TODO: New API https://developers.google.com/identity/gsi/web/reference/js-reference
export default function UFGoogleCallback() {
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
      setErrorMessage(hashParams.get('error'));
    } else {
      setErrorMessage('Invalid IdP response');
    }
  };

  const handleLoginSuccess = (access_token) => {
    // Send access token to backend
    axios
      .post('/userAuth/login/ufgoogle', { access_token }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      })
      .then((response) => {
        console.log(response?.data);
        const accessToken = response?.data?.accessToken;
        const roles = response?.data?.roles;
        const email = response?.data?.email;
        const firstName = response?.data?.firstName;
        const lastName = response?.data?.lastName;
        setAuth({ accessToken, roles, email, firstName, lastName });
        navigate('/');
      })
      .catch((error) => {
        console.log(error);
        if (error?.response?.data?.message) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage('Unable to log you in');
        }
      });
  };

  const handleRetryLogin = () => {
    navigate('/');
  }

  useEffect(HandleGoogleCallback, []);

  return (
    <div>
      <Header loading={!errorMessage} />
      <div className='LoginWindow'>
        <div className='LoginWindow__window'>
          <Paper variant='outlined'>
            <Box margin='24px' marginBottom='48px'>
              {errorMessage ? (
                <Alert severity="error" action={
                  <Button color="inherit" size="medium" onClick={handleRetryLogin}>
                    Retry
                  </Button>
                }><AlertTitle>An error occurred while logging you in.</AlertTitle>{errorMessage}</Alert>
              ) : (
                <Box align='center' marginY="48px">
                  <CircularProgress />
                  <Typography variant='body1' align='center' marginTop="24px" sx={
                    {
                      'font-size': '1.5rem',
                      'font-weight': '400',
                      'line-height': '2rem',
                      'width': '100%'
                    }
                  }>Logging you in...</Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </div>
      </div>
    </div>
  );
};
