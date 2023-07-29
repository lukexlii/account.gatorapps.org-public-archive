import Homepage from './views/Homepage/Homepage';
import Student from './views/Student/Student';
import Admin from './views/Admin/Admin';
import UFGoogleCallback from './components/Login/Callbacks/UFGoogleCallback';
import AppAuth from './views/Auth/AppAuth';
import RequireAuth from './components/Auth/RequireAuth';
import PersistLogin from './components/Auth/PersistLogin';
import { Routes, Route } from 'react-router-dom';
import GenericPage from './components/GenericPage/GenericPage';

function App() {

  return (
    <Routes>
      {/* public routes */}
      <Route path="/login/ufgoogle/callback" element={<UFGoogleCallback />} />

      {/* protected routes */}
      <Route element={<PersistLogin />}>
        <Route path="/" element={<Homepage />} />

        <Route path="/appauth" element={<AppAuth />} />

        <Route path="/test" element={<GenericPage />} />

        <Route element={<RequireAuth allowedRoles={['student']} />}>
          <Route path="/student" element={<Student />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={['admin']} />}>
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Route>

      {/* catch all */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}

export default App;