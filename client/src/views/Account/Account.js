import { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import SkeletonGroup from '../../components/SkeletonGroup/SkeletonGroup';
import { Box, Button, Container, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText, Divider, FormControl, Grid, InputAdornment, InputLabel, OutlinedInput, Paper, TextField, Tooltip, Typography } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
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

  // Profile
  const profileItems = [
    { id: "name", label: "Name", value: "Luke Li" },
    { id: "nickName", label: "Nick Name", value: "Luke's Testing Nick Name", update: { description: "Plase enter your new nick name. Leave blank to use your full name as default nick name.", postRoute: "/appApi/account/updateUserProfile" } },
    { id: "organizationalDomain", label: "Organizational Domain", value: "UFL.EDU" },
    { id: "organizationalID", label: "Organizational ID", value: "luke.li" },
    { id: "currentAffiliation", label: "Current Affiliation", value: "Verified", verification: { verified: true } },
    { id: "unverifiedTesting", label: "Unverified Testing", value: "Unverified", verification: { verified: false } }
  ];
  // Profile update dialogue
  const [profileUpdateDialogue, setProfileUpdateDialogue] = useState({ open: false, item: undefined });
  const handleProfileUpdateDialogueOpen = (item) => {
    setProfileUpdateDialogue({ open: true, item });
  };
  const handleProfileUpdateDialogueClose = () => {
    setProfileUpdateDialogue(prev => ({ ...prev, open: false }));
  };

  const renderProfileItems = () => {
    return (
      <Fragment>
        <Grid container spacing={3}>
          {profileItems.map((item, itemIndex) => {
            return (
              <Grid item xs={12} sm={12} md={6}>
                <FormControl disabled fullWidth variant="outlined">
                  <InputLabel htmlFor={"profile-" + itemIndex}>{item.label}</InputLabel>
                  <OutlinedInput id={"profile-" + itemIndex} value={item.value} endAdornment={
                    <InputAdornment position="end">
                      {item?.update && (<Button size="medium" onClick={() => handleProfileUpdateDialogueOpen(item)} sx={{ marginLeft: '16px', height: '36px', minWidth: '36px' }}>Update</Button>)}
                      {item?.verification && (
                        (item?.verification?.verified
                          ? (
                            <Tooltip title="Verified" arrow>
                              <Button size="medium" sx={{ marginLeft: '16px', height: '36px', minWidth: '36px' }}>
                                <CheckCircleOutlineIcon />
                              </Button>
                            </Tooltip>
                          ) : (
                            <Tooltip title="Unverified" arrow>
                              <Button size="medium" sx={{ marginLeft: '16px', height: '36px', minWidth: '36px' }}>
                                <HelpOutlineIcon />
                              </Button>
                            </Tooltip>
                          ))
                      )}
                    </InputAdornment>
                  }
                    label={item.label}
                  />
                </FormControl>
              </Grid>
            )
          })}
        </Grid >

        {/* Update profile field dialogue */}
        <Dialog open={profileUpdateDialogue.open} onClose={handleProfileUpdateDialogueClose}>
          <DialogTitle>{"Update " + profileUpdateDialogue?.item?.label}</DialogTitle>
          <DialogContent sx={{ width: '512px' }}>
            <DialogContentText sx={{ marginBottom: '14px' }}>
              {profileUpdateDialogue?.item?.update?.description}
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id={"profile" + profileUpdateDialogue?.item?.id}
              label={profileUpdateDialogue?.item?.label}
              defaultValue={profileUpdateDialogue?.item?.value}
              type=""
              fullWidth
              variant="outlined"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleProfileUpdateDialogueClose}>Cancel</Button>
            <Button onClick={handleProfileUpdateDialogueClose}>Save</Button>
          </DialogActions>
        </Dialog>
      </Fragment>
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