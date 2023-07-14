import { Header } from '../../components/Header/Header.js';
import useAuth from '../../hooks/useAuth';

const Student = () => {
  const { auth } = useAuth();

  return (
    <div className="student">
      <Header />
      <div>
        <div>Welcome to student page, {auth?.firstName}!</div>
        <div>First name: {auth?.firstName}</div>
        <div>Last name: {auth?.lastName}</div>
        <div>Email: {auth?.email}</div>
      </div>
    </div>
  );
}

export default Student;
