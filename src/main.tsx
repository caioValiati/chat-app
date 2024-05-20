import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './pages/Home/App.tsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import Login from './pages/Login/Login.tsx';
import Register from './pages/Register/Register.tsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

const bearer = localStorage.getItem('Bearer')

if (window.location.pathname === '/' && !bearer) {
  window.location.href = '/login'
}
if (window.location.pathname === '/login' && !!bearer) {
  window.location.href = '/'
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
