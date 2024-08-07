import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Detail from './components/Detail';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Payment from './components/Payment';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, createBrowserRouter, RouterProvider } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    // element: <ProtectedRoute element={<Dashboard />} />,
    element : <Dashboard />
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/detail/:Id/:start/:end',
    // element: <ProtectedRoute element={<Detail />} />,
    element: <Detail />
  },
  {
    path: '/book/:Id/:start/:end',
    element: <ProtectedRoute element={<Payment />} />,
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
