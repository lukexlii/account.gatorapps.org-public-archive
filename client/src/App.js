import Homepage from './views/Homepage/Homepage';
import Student from './views/Student/Student';
import Admin from './views/Admin/Admin';
import UFGoogleCallback from './views/Login/Callbacks/UFGoogleCallback';
import RequireAuth from './components/RequireAuth/RequireAuth';
import PersistLogin from './components/PersistLogin/PersistLogin';
import { Routes, Route } from 'react-router-dom';

function App() {

  return (
    <Routes>
      {/* public routes */}
      <Route path="/login/ufgoogle/callback" element={<UFGoogleCallback />} />

      {/* protected routes */}
      <Route element={<PersistLogin />}>
        <Route path="/" element={<Homepage />} />
        
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