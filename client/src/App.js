import Admin from './views/Admin/Admin';
import ErrorPage from './views/ErrorPage/ErrorPage';
import Homepage from './views/Homepage/Homepage';
import InitializeApp from './components/InitializeApp/InitializeApp';
import RequireAuth from './components/RequireAuth/RequireAuth';
import SignIn from './views/SignIn/SignIn';
import UFGoogleCallback from './views/SignIn/Callbacks/UFGoogleCallback';
import { Routes, Route } from 'react-router-dom';
import GenericPage from './components/GenericPage/GenericPage';

function App() {
  return (
    <Routes>
      {/* sign ins */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signin/callback/ufgoogle" element={<UFGoogleCallback />} />

      <Route element={<InitializeApp />}>
        {/* public routes */}
        <Route path="/test" element={<GenericPage />} />

        {/* protected routes */}
        <Route element={<RequireAuth allowedRoles={[100001]} />}>
          <Route path="/" element={<Homepage />} />
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