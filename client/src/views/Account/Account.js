import { Fragment, useState, useEffect } from "react";
import { Box, Button, Container, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText, Divider, FormControl, Grid, InputAdornment, InputLabel, OutlinedInput, Paper, TextField, Tooltip, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SaveIcon from '@mui/icons-material/Save';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Alert from '../../components/Alert/Alert';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import SkeletonGroup from '../../components/SkeletonGroup/SkeletonGroup';
import { axiosPrivate } from '../../apis/backend';
import useGetUserInfo from '../../hooks/useGetUserInfo';

const Account = () => {
  const [loading, setLoading] = useState(true);
  const [alertData, setAlertData] = useState(undefined);
  const [profileItems, setProfileItems] = useState([]);
  const refreshUserInfo = useGetUserInfo();

  const initializeSection = async () => {
    setLoading(true);
    setAlertData(undefined);

    try {
      const response = await axiosPrivate.get('/userProfile/getProfileSection');
      setProfileItems(JSON.parse(response?.data?.profileItems));
    } catch (error) {
      setAlertData({
        severity: error?.response?.data?.alertSeverity ? error.response.data.alertSeverity : "error",
        title: (error?.response?.data?.errCode ? "Unable to load your account profile: " + error?.response?.data?.errCode : "Unknown error"),
        message: (error?.response?.data?.errMsg ? error?.response?.data?.errMsg : "We're sorry, but we are unable to process your request at this time. Please try again later"),
        actions: [{ name: "Retry", onClick: () => { initializeSection() } }]
      });
      return;
    }

    // initialize other sections

    setLoading(false);
  }

  useEffect(() => {
    initializeSection()
  }, []);

  // Profile update
  //// Dialogue
  // Make dialogue full screen on small screens; currently not enabled
  // const theme = useTheme();
  // const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [profileUpdateDialogue, setProfileUpdateDialogue] = useState({ open: false, item: undefined, updating: false });
  const handleProfileUpdateDialogueOpen = (item) => {
    setProfileUpdateDialogue({ open: true, item, newValue: item.value });
  };
  const handleProfileUpdateDialogueClose = () => {
    setProfileUpdateDialogue(prev => ({ ...prev, open: false }));
  };

  //// Update
  const updateProfile = async (item, newValue) => {
    setProfileUpdateDialogue(prev => ({ ...prev, updating: true }));

    try {
      const response = await axiosPrivate.post(item.update.postRoute, {
        payload: {
          id: item.id,
          value: newValue
        }
      });
    } catch (error) {
      setAlertData({
        severity: error?.response?.data?.alertSeverity ? error.response.data.alertSeverity : "error",
        title: (error?.response?.data?.errCode ? "Unable to load your account profile: " + error?.response?.data?.errCode : "Unknown error"),
        message: (error?.response?.data?.errMsg ? error?.response?.data?.errMsg : "We're sorry, but we are unable to process your request at this time. Please try again later"),
        actions: [{ name: "Retry", onClick: () => { initializeSection() } }]
      });
      return;
    }

    initializeSection();
    setProfileUpdateDialogue({ open: false, item: undefined, updating: false });
    // So new data syncs in other components, such as header account dropdown
    refreshUserInfo();
  }

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
          <DialogContent sx={{ maxWidth: '512px' }}>
            <DialogContentText sx={{ marginBottom: '14px' }}>
              {profileUpdateDialogue?.item?.update?.description}
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id={"profile" + profileUpdateDialogue?.item?.id}
              label={profileUpdateDialogue?.item?.label}
              value={profileUpdateDialogue.newValue}
              onChange={(event) => { setProfileUpdateDialogue(prev => ({ ...prev, newValue: event.target.value })) }}
              type=""
              fullWidth
              variant="outlined"
              disabled={profileUpdateDialogue.updating}
            />
          </DialogContent>
          <DialogActions sx={{ margin: '0 12px 10px 0' }}>
            <Button onClick={handleProfileUpdateDialogueClose}><span>Cancel</span></Button>
            <LoadingButton
              loading={profileUpdateDialogue.updating}
              loadingPosition="start"
              startIcon={<SaveIcon />}
              variant="outlined"
              onClick={() => updateProfile(profileUpdateDialogue?.item, profileUpdateDialogue.newValue)}
              disabled={profileUpdateDialogue.newValue === profileUpdateDialogue?.item?.value}>
              <span>Save</span>
            </LoadingButton>
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
                <Box sx={{ margin: '24px' }}>
                  {alertData ? (
                    <Alert alertData={alertData} />
                  ) : (
                    <Fragment>
                      <SkeletonGroup />
                      <SkeletonGroup />
                      <SkeletonGroup />
                    </Fragment>
                  )
                  }
                </Box>
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