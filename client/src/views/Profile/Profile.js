import { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import SkeletonGroup from '../../components/SkeletonGroup/SkeletonGroup';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import useAuth from '../../hooks/useAuth';
import { axiosPrivate } from '../../apis/backend';
//import { handleLogout } from '../../components/RequireAuth/AuthFunctions'

const Profile = () => {
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

  return (
    <div className='GenericPage'>
      <Header/>
      <main>
        <Box>
          <Container maxWidth="lg">
            <Box className="GenericPage__container_title_box GenericPage__container_title_flexBox GenericPage__container_title_flexBox_left">
              <Box className="GenericPage__container_title_flexBox GenericPage__container_title_flexBox_left">
                <Typography variant="h1">Account Profile</Typography>
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
              <Fragment>
                <div>1</div>
              </Fragment>
            )}
            </Paper>
          </Container>
        </Box>
      </main>
      <Footer/>
    </div>
  );
}

export default Profile;