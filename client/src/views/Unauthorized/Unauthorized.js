import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Error from '../../components/Alert/Error';

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
      <Error marginTop='36px' error={error} />
    </div>
  );
}

export default Unauthorized;
