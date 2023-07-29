import { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import SkeletonGroup from '../../components/SkeletonGroup/SkeletonGroup';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import useAuth from '../../hooks/useAuth';
import { axiosPrivate } from '../../apis/backend';
//import { handleLogout } from '../../components/RequireAuth/AuthFunctions'

const Account = () => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleLogout = () => {
    axiosPrivate
      .post('/userAuth/logout')
      .then((response) => {
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
      });
  };

  const renderAccountContent = () => {
    return (
      <Fragment>
        <Box>
          <Typography variant="h3" sx={{ 'color': 'rgb(191, 68, 24)', 'font-size': '1.5rem', 'text-align': 'left' }}>Profile</Typography>
          <Divider sx={{ marginTop: '8px', marginBottom: '24px' }}/>
        </Box>
        <Box sx={{ 'display': 'flex', 'marginY': '12px', 'align-items': 'center' }}>
          <TextField disabled fullWidth label="Nick Name" value="Luke Li"/>
          <Button variant="outlined" size="medium" onClick={undefined} sx={{ marginLeft: '16px', height: '36px' }}>Update</Button>
        </Box>
        <TextField disabled fullWidth label="Organizational Domain" value="ufl.edu" sx={{ 'marginY': '8px' }}/>
        <TextField disabled fullWidth label="Organizational ID" value="luke.li" sx={{ 'marginY': '8px' }}/>
        <TextField disabled fullWidth label="Name" value="Luke Li" sx={{ 'marginY': '8px' }}/>
        <FormControl disabled fullWidth variant="outlined" sx={{ 'marginY': '8px' }}>
          <InputLabel htmlFor="outlined-adornment-current-affiliation">Current Affiliation</InputLabel>
          <OutlinedInput id="outlined-adornment-current-affiliation" value="Active" endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  edge="end"
                >
                  <CheckCircleOutlineIcon sx={{ color: "green" }}/>
                </IconButton>
              </InputAdornment>
            }
            label="Current Affiliation"
          />
        </FormControl>
      </Fragment>
    )
  }

  return (
    <div className='GenericPage'>
      <Header/>
      <main>
        <Box>
          <Container maxWidth="lg">
            <Box className="GenericPage__container_title_box GenericPage__container_title_flexBox GenericPage__container_title_flexBox_left">
              <Box className="GenericPage__container_title_flexBox GenericPage__container_title_flexBox_left">
                <Typography variant="h1">Account</Typography>
                <Button size="medium" sx={{ 'margin-left': '16px' }}>Button</Button>
              </Box>
              <Box className="GenericPage__container_title_flexBox GenericPage__container_title_flexBox_right" sx={{ 'flex-grow': '1' }}>
                <Box className="GenericPage__container_title_flexBox_right">
                  <Button variant="contained" size="medium" onClick={handleLogout}>Log out</Button>
                </Box>
              </Box>
            </Box>
          </Container>
          <Container maxWidth="lg">
            <Paper className='GenericPage__container_paper' variant='outlined'>
            {loading ? (
              <Fragment>
                <SkeletonGroup/>
                <SkeletonGroup/>
                <SkeletonGroup/>
              </Fragment>
            ) : (
              <Box sx={{ padding: '32px' }}>
                {renderAccountContent()}
              </Box>
            )}
            </Paper>
          </Container>
        </Box>
      </main>
      <Footer/>
    </div>
  );
}

export default Account;