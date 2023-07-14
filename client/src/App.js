import Homepage from './views/Homepage/Homepage';
import Student from './views/Student/Student';
import UFGoogleCallback from './views/Login/Callbacks/UFGoogleCallback';
import RequireAuth from './components/RequireAuth/RequireAuth';
import { Routes, Route } from 'react-router-dom';

function App() {

  return (
    <Routes>
      {/* public routes */}
      <Route path="/" element={<Homepage />} />
      <Route path="/login/ufgoogle/callback" element={<UFGoogleCallback />} />

      {/* protected routes */}
      <Route element={<RequireAuth allowedRoles={['student']} />}>
        <Route path="/student" element={<Student />} />
      </Route>

      {/* catch all */}
      <Route path="*" element={<div></div>} />
    </Routes>
  );
}

export default App;