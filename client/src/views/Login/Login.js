import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/Header/Header';
import LoginWindow from '../../components/LoginWindow/LoginWindow';
import Alert from '../../components/Alert/Alert';
import { Container } from '@mui/material';
import useAuth from '../../hooks/useAuth';
import axios from '../../apis/backend';

const Login = () => {
  const { auth } = useAuth();
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

    if (!app && !state) {
      setAlertData(undefined);
      setLoading(false);
      return;
    };

    axios
      .post('/appAuth/validateRequest', { app, state }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
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
        setAlertData({
          severity: error?.response?.data?.alertSeverity ? error.response.data.alertSeverity : "error",
          title: (error?.response?.data?.errCode ? "Unable to load your login session: " + error?.response?.data?.errCode : "Unknown error"),
          message: (error?.response?.data?.errMsg ? error?.response?.data?.errMsg : "We're sorry, but we are unable to process your request at this time. Please try again later")
        });
        return;
      });
  };

  useEffect(validateAppAuth, []);

  return (
    <div className="AppAuth">
      <Header />
      {alertData && (
        <Container maxWidth="lg" sx={{ marginY: '16px' }}>
          <Alert alertData={alertData} />
        </Container>
      )}
      {!loading && <LoginWindow />}
    </div>
  );
}

export default Login;