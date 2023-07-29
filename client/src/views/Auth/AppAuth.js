import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/Header/Header';
import LoginWindow from '../../components/Login/LoginWindow';
import Alert from '../../components/Alert/Alert';
import { Container } from '@mui/material';
import useAuth from '../../hooks/useAuth';

const AppAuth = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [severity, setSeverity] = useState("info");
  const [alertData, setAlertData] = useState({
    title: "Loading",
    message: "Please wait while we process your request ...",
  });

  const validateAppAuth = () => {
    const query = new URLSearchParams(location.search);
    const service = query.get('service');
    const state = query.get('state');

    if (!service) {
      setSeverity("error");
      setAlertData({
        title: "Invalid authentication request: service undefined",
        message: "You requested authentication without specifying a target service, please examine your request and try again"
      });
      return;
    };

    if (!state) {
      setSeverity("error");
      setAlertData({
        title: "Invalid authentication request: state undefined",
        message: "Your authentication request does not contain a state, please examine your request and try again"
      });
      return;
    };

    setAlertData({
      title: "Welcome",
      message: "Please authenticate yourself bellow to continue to ...",
      actions: [{ name: "Cancel", onClick: () => { navigate('/'); } }]
    });
  };

  useEffect(validateAppAuth, []);

  return (
    <div className="AppAuth">
      <Header />
      <Container maxWidth="lg" sx={{ marginY: '16px' }}>
        <Alert severity={severity} alertData={alertData} />
      </Container>
      {loading ? <></> : <LoginWindow />}
    </div>
  );
}

export default AppAuth;