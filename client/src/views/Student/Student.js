import { useState, useEffect } from "react";
import { Header } from '../../components/Header/Header.js';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";

const Student = () => {
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getProfile = async () => {
        try {
            const response = await axiosPrivate.get('/api/profile/name', {
                signal: controller.signal
            });
            if (isMounted) {
              setFirstName(response.data.firstName);
              setLastName(response.data.lastName);
            }
        } catch (error) {
          console.log(error);
            //navigate('/', { state: { from: location }, replace: true });
        }
    }

    getProfile();

    return () => {
        isMounted = false;
        controller.abort();
    }
  }, []);

  return (
    <div className="student">
      <Header />
      <div>
        <div>Welcome to student page, {firstName}!</div>
        <div>First name: {firstName}</div>
        <div>Last name: {lastName}</div>
      </div>
    </div>
  );
}

export default Student;
