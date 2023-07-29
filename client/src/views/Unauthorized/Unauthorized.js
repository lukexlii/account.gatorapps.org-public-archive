import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Alert from '../../components/Alert/Alert';
import { Container } from '@mui/material';

const Unauthorized = () => {
  const navigate = useNavigate();

  const error = {
    title: "Unauthorized",
    message: "We are sorry, but you do not have permission to view this resource.",
    actions: [{ name: "Return Home", onClick: () => { navigate('/'); } }]
  }

  return (
    <div className="Unauthorized">
      <Header />
      <Container maxWidth="lg" sx={{ marginTop: '36px' }}>
        <Alert severity="error" error={error} />
      </Container>
    </div>
  );
}

export default Unauthorized;
