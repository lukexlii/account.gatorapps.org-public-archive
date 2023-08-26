import { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import SkeletonGroup from '../../components/SkeletonGroup/SkeletonGroup';
import { Box, Button, Container, Divider, FormControl, Grid } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useDispatch, useSelector } from 'react-redux';
//import { setUserInfo } from '../../context/authSlice';
//import { handleSignOut } from '../../components/RequireAuth/AuthFunctions'

const Account = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const renderProfileItems = () => {
    const profileItems = [
      { id: "name", label: "Name", data: "Luke Li" },
      { id: "nickName", label: "Nick Name", data: "Luke's Testing Nick Name", updateRoute: "/appApi/account/updateUserProfile" },
      { id: "organizationalDomain", label: "Organizational Domain", data: "UFL.EDU" },
      { id: "organizationalID", label: "Organizational ID", data: "luke.li" },
      { id: "currentAffiliation", label: "Current Affiliation", data: "Verified" }
    ];

    return (
      <Grid container spacing={3}>
        {profileItems.map((item, itemIndex) => {
          return (
            <Grid item xs={12} sm={12} md={6}>
              <FormControl disabled fullWidth variant="outlined">
                <InputLabel htmlFor={"profile-" + item.id}>{item.label}</InputLabel>
                <OutlinedInput id={"profile-" + item.id} value={item.data} endAdornment={
                  (item.updateRoute && (
                    <InputAdornment position="end">
                      <Button size="medium" onClick={undefined} sx={{ marginLeft: '16px', height: '36px' }}>Update</Button>
                    </InputAdornment>
                  ))
                }
                  label={item.label}
                />
              </FormControl>
            </Grid>
          )
        })}
      </Grid>
    )
  }

  return (
    <div className='GenericPage'>
      <Header />
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
                  <Button variant="contained" size="medium">Button</Button>
                </Box>
              </Box>
            </Box>
          </Container>
          <Container maxWidth="lg">
            <Paper className='GenericPage__container_paper' variant='outlined'>
              {loading ? (
                <Fragment>
                  <SkeletonGroup />
                  <SkeletonGroup />
                  <SkeletonGroup />
                </Fragment>
              ) : (
                <Box sx={{ padding: '32px' }}>
                  <Box>
                    <Typography variant="h3" sx={{ 'color': 'rgb(191, 68, 24)', 'font-size': '1.5rem', 'text-align': 'left' }}>Profile</Typography>
                    <Divider sx={{ marginTop: '8px', marginBottom: '24px' }} />
                  </Box>
                  {renderProfileItems()}
                </Box>
              )}
            </Paper>
          </Container>
        </Box>
      </main>
      <Footer />
    </div>
  );
}

export default Account;