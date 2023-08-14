import Homepage from './views/Homepage/Homepage';
import Student from './views/Student/Student';
import Admin from './views/Admin/Admin';
import UFGoogleCallback from './views/SignIn/Callbacks/UFGoogleCallback';
import SignIn from './views/SignIn/SignIn';
import RequireAuth from './components/Auth/RequireAuth';
import PersistLogin from './components/Auth/PersistLogin';
import { Routes, Route } from 'react-router-dom';
import GenericPage from './components/GenericPage/GenericPage';

function App() {

  return (
    <Routes>
      {/* public routes */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signin/ufgoogle/callback" element={<UFGoogleCallback />} />

      {/* protected routes */}
      <Route element={<PersistLogin />}>
        <Route path="/test" element={<GenericPage />} />

        <Route element={<RequireAuth allowedRoles={[100001]} />}>
          <Route path="/" element={<Homepage />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={[100101]} />}>
          <Route path="/student" element={<Student />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={[200999]} />}>
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Route>

      {/* catch all */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}

export default App;