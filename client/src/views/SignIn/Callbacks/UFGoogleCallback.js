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

// Google OAuth: https://developers.google.com/identity/protocols/oauth2
// Potential TODO: New API https://developers.google.com/identity/gsi/web/reference/js-reference
export default function UFGoogleCallback() {
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const HandleGoogleCallback = () => {
    // Potential TODO: frontend HD validation
    const allowedHDs = ['ufl.edu'];
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    //window.history.replaceState({}, document.title, '../..');

    if (code && code) {
      handleLoginSuccess(code, state);
    } else if (searchParams.get('error')) {
      setErrorMessage(searchParams.get('error'));
    } else {
      setErrorMessage('Invalid IdP response');
    }
  };

  const handleLoginSuccess = (code, state) => {
    // Send access token to backend
    axios
      .post('/userAuth/signIn/callback/ufgoogle', { code, state }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      })
      .then((response) => {
        if (response.data?.continueToUrl) {
          return window.location.href = response.data.continueToUrl;
        } else {
          return navigate('./');
        }
      })
      .catch((error) => {
        console.log(error);
        if (error?.response?.data?.errMsg) {
          setErrorMessage(error.response.data.errMsg);
        } else {
          setErrorMessage('Unable to sign you in');
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
      <div className='SignInWindow'>
        <div className='SignInWindow__window'>
          <Paper variant='outlined'>
            <Box margin='24px' marginBottom='48px'>
              {errorMessage ? (
                <Alert severity="error" action={
                  <Button color="inherit" size="medium" onClick={handleRetryLogin}>
                    Retry
                  </Button>
                }><AlertTitle>An error occurred while signing you in.</AlertTitle>{errorMessage}</Alert>
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
                  }>Signing you in...</Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </div>
      </div>
    </div>
  );
};
