/* eslint-disable react/jsx-pascal-case */
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
import Rule from "./pages/user/Rule";

import Appbar_master from "./component/AppbarMaster";
import Ad_Home from "./pages/admin/Ad_Home";
import Ad_Edit from "./pages/admin/Ad_Edit";
import Ad_Analytic from "./pages/admin/Ad_Analytic";
import Sidebar from "./component/Sidebar";
import SidebarAdmin from "./component/SidebarAdmin";
import Ad_Schedule from "./pages/admin/Ad_Schedule";
import Ad_Room from "./pages/admin/Ad_Room";

import Footer from "./component/Footer";
import Account from "./pages/user/Account";
import Ad_Custom from "./pages/admin/Ad_Custome";

let data = JSON.parse(localStorage.getItem("user-provider"));

let positionType = "user";

if (data !== null) {
  positionType = data.pos;
}

console.log(positionType);

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
    path: "account",
    element: (
      <>
        <Appbar_master />
        <Sidebar value={0}/>
        <Account />
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

        {positionType !== "admin" ? (
          <>
            <Home /> <Footer />
          </>
        ) : (
          <>
            <SidebarAdmin value={0} page={<Ad_Home />} />
          </>
        )}
      </>
    ),
  },
  {
    path: "/room",
    element: (
      <>
      <Appbar_master />
        <SidebarAdmin value={3} page={<Ad_Room />} />
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
        <Sidebar value={1} />
        <History />
        <Footer />
      </>
    ),
  },
  {
    path: "/rule",
    element: (
      <>
        <Appbar_master />
        <Rule />
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
        <SidebarAdmin page={<Detail />} />
      </>
    ),
  },
  {
    path: "/schedule",
    element: (
      <>
        <Appbar_master />
        <SidebarAdmin page={<Ad_Schedule />} />
      </>
    ),
  },
  {
    path: "/ad_analytic",
    element: (
      <>
        <Appbar_master />

        <SidebarAdmin value={2} page={<Ad_Analytic />} />
      </>
    ),
  },
  {
    path: "/ad_custom",
    element: (
      <>
        <Appbar_master />

        <SidebarAdmin value={4} page={<Ad_Custom />} />
      </>
    ),
  },
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
