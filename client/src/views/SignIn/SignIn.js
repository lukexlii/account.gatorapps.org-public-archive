import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/Header/Header';
import SignInWindow from '../../components/SignInWindow/SignInWindow';
import Alert from '../../components/Alert/Alert';
import { Container } from '@mui/material';
import { useSelector } from 'react-redux';
import { axiosPrivate } from '../../apis/backend';

const SignIn = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);

  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [alertData, setAlertData] = useState({
    severity: "info",
    title: "Loading",
    message: "Please wait while we process your request ...",
  });

  const validateAppAuth = () => {
    const query = new URLSearchParams(location.search);
    const app = query.get('app');
    const state = query.get('state');
    const continueTo = query.get('continueTo');

    axiosPrivate
      .get("/userAuth/signIn/validateRequest" + (continueTo ? `?continueTo=${continueTo}` : ""))
      .then((response) => {
        setAlertData({
          severity: response?.data?.alertSeverity ? response.data.alertSeverity : "info",
          title: response?.data?.alertTitle ? response.data.alertTitle : "Welcome",
          message: response?.data?.alertMessage ? response.data.alertMessage : (response?.data?.errMsg ? response.data.errMsg : "Please authenticate yourself bellow"),
          actions: [{ name: "Cancel", onClick: () => { navigate('/'); } }]
        });
        setLoading(false);
        return;
      })
      .catch((error) => {
        // If no sign in required (such as already signed in), go to continueToUrl provided by server
        if (error?.response?.data?.continueToUrl) return window.location.href = error?.response?.data?.continueToUrl;

        setAlertData({
          severity: error?.response?.data?.alertSeverity ? error.response.data.alertSeverity : "error",
          title: (error?.response?.data?.errCode ? "Unable to load your sign in session: " + error?.response?.data?.errCode : "Unknown error"),
          message: (error?.response?.data?.errMsg ? error?.response?.data?.errMsg : "We're sorry, but we are unable to process your request at this time. Please try again later"),
          actions: [{ name: "Cancel", onClick: () => { navigate('/'); } }]
        });
        return;
      });
  };

  useEffect(validateAppAuth, []);

  return (
    <div className="AppAuth">
      <Header isSignedIn={false} loading={loading} />
      {alertData && (
        <Container maxWidth="lg" sx={{ marginY: '16px' }}>
          <Alert data={alertData} />
        </Container>
      )}
      {!loading && <SignInWindow />}
    </div>
  );
}

export default SignIn;