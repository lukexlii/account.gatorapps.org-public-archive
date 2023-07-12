import React from 'react';
import Homepage from './views/Homepage/Homepage';
import Login from './views/Login/Login';
import UFGoogleCallback from './views/Login/Callbacks/UFGoogleCallback';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import { AuthProvider } from './context/AuthProvider';

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Homepage />
    ),
  },
  {
    path: "/login",
    element: (
      <Login />
    ),
  },
  {
    path: "/login/ufgoogle/callback",
    element: (
      <UFGoogleCallback />
    ),
  },
  {
    path: "/*",
    element: <div>404 Not Found</div>
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);
