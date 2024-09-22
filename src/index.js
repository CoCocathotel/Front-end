import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Detail from "./component/Detail";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/user/Dashboard";
import Home from "./pages/user/Home";
import reportWebVitals from "./reportWebVitals";
import {
  BrowserRouter,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Register from "./pages/auth/Register";
import History from "./pages/user/History";

import Appbar_master from "./component/AppbarMaster";
import Ad_Home from "./pages/admin/Ad_Home";
import Ad_Edit from "./pages/admin/Ad_Edit";
import Ad_Analytic from "./pages/admin/Ad_Analytic"

import Footer from "./component/Footer";

const router = createBrowserRouter([
  {
    path: "/booking",
    element: (
      <>
        <Appbar_master />
        <Dashboard />
        <Footer />
      </>
    ),
  },
  {
    path: "detail/:Type",
    element: (
      <>
        <Appbar_master />
        <Detail />
        <Footer />
      </>
    ),
  },
  {
    path: "history/:id",
    element: (
      <>
        <Appbar_master />
        <Detail />
        <Footer />
      </>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <>
        <Appbar_master />
        <Home />
        <Footer />
      </>
    ),
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/history",
    element: (
      <>
        <Appbar_master />
        <History />
        <Footer />
      </>
    ),
  },
  {
    path: "/admin_home",
    element: (
      <>
        <Appbar_master />
        <Ad_Home />
      </>
    ),
  },
  {
    path: "/admin_edit/:id",
    element: (
      <>
        <Appbar_master />
        <Detail />
      </>
    ),
  },
  {
    path:"/ad_analytic",
    element:(
    <>
    <Appbar_master />
    <Ad_Analytic />
    </>
  )
  }
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
