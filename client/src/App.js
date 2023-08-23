import Admin from './views/Admin/Admin';
import ErrorPage from './views/ErrorPage/ErrorPage';
import Homepage from './views/Homepage/Homepage';
import PersistLogin from './components/Auth/PersistLogin';
import RequireAuth from './components/Auth/RequireAuth';
import SignIn from './views/SignIn/SignIn';
import Student from './views/Student/Student';
import UFGoogleCallback from './views/SignIn/Callbacks/UFGoogleCallback';
import { Routes, Route } from 'react-router-dom';
import GenericPage from './components/GenericPage/GenericPage';

function App() {
  return (
    <Routes>
      {/* sign in callbacks */}
      <Route path="/signin/ufgoogle/callback" element={<UFGoogleCallback />} />

      <Route element={<PersistLogin />}>
        {/* public routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/test" element={<GenericPage />} />

        {/* protected routes */}
        <Route element={<RequireAuth allowedRoles={[100001]} />}>
          <Route path="/" element={<Homepage />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={[100101]} />}>
          <Route path="/student" element={<Student />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={[200999]} />}>
          <Route path="/admin" element={<Admin />} />
        </Route>

        {/* catch all */}
        <Route path="*" element={<ErrorPage error="404" />} />
      </Route>
    </Routes>
  );
}

export default App;