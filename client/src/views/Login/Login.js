import React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import './Login.css';

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

}

class Login extends React.Component {
  render() {
    return (
      <div className='login'>
        <div className='login__window'>
          <Paper variant='outlined'>
            <Box margin='24px'>
              <Box marginY='16px'>
                <Typography variant='body1' align='center' sx={
                  {
                    'font-size': '1.5rem',
                    'font-weight': '400',
                    'line-height': '2rem',
                    'width': '100%'
                  }
                }>Students, Faculty & Staff</Typography>
              </Box>
              <Box marginY='16px'>
                <Button variant='contained' size='medium' color='primary' fullWidth={true} onClick={UFLoginViaGoogle} sx={
                  {
                    'font-size': '1.375rem',
                    'font-weight': '700',
                    'text-transform': 'none',
                    'background-color': 'rgb(40, 87, 151)'
                  }
                }>
                  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 43.5 29.4' height='36' width='36' fill='white' icon='logo-uf'><path d='M31.1 24.2v-7.5h6.8v-4.9h-6.8V4.9h7.5v2.7h4.9V0H23.7v4.9h1.8v19.3h-1.8v4.9h9.1v-4.9h-1.7zM21.1 18.1V4.9h1.8V0h-9.2v4.9h1.8v11.6c0 4.9-.6 7.2-4 7.2s-4-2.3-4-7.2V4.9h1.8V0H0v4.9h1.8v13.2c0 2.9 0 5.3 1.4 7.4 1.5 2.4 4.3 3.9 8.3 3.9 7.1 0 9.6-3.7 9.6-11.3z'></path></svg>
                  <Box paddingLeft='16px'>Log in with GatorLink</Box>
                </Button>
              </Box>
              <Box marginTop='32px' marginBottom='16px'>
                <hr style={{ margin: 'auto', width: '75%' }}></hr>
              </Box>
              <Box marginY='16px'>
                <Typography variant='body1' align='center' sx={
                  {
                    'font-size': '1.5rem',
                    'font-weight': '400',
                    'line-height': '2rem',
                    'width': '100%'
                  }
                }>Alumni & Friends</Typography>
              </Box>
              <Box marginTop='16px' marginBottom='32px'>
                <Button variant='contained' size='medium' color='primary' fullWidth={true} onClick={UFLoginViaGoogle} sx={
                  {
                    'font-size': '1.375rem',
                    'font-weight': '700',
                    'text-transform': 'none'
                  }
                } disabled>
                  <Box paddingLeft='16px'>Coming soon...</Box>
                </Button>
              </Box>
            </Box>
          </Paper>
        </div>
      </div>
    );
  }
}

export default Login;
