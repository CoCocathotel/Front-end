import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Detail from './component/Detail';
import Login from './component/Login';
import Dashboard from './component/Dashboard';
import Home from './component/Home';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, createBrowserRouter, RouterProvider } from 'react-router-dom';
import Register from './component/Register';
import History from './component/History';
import Ad_Home from './admin/Ad_Home';

const router = createBrowserRouter([
  {
    path: '/',
    // element: <ProtectedRoute element={<Dashboard />} />,
    element : <Dashboard />
  },
  {
    path: 'detail/:Type',
    element: <Detail />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/home',
    element: <Home />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/history',
    element: <History />
  },
  {
    path: '/admin_home',
    element: <Ad_Home />
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
