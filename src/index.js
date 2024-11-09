/* eslint-disable react/jsx-pascal-case */
import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { RouterProvider } from "react-router-dom";
import { UserProvider } from "./context/UserContext"; // Import the UserProvider

const router = require("./router/router").default;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <UserProvider> Wrap your app with UserProvider */}
      <RouterProvider router={router} />
    {/* </UserProvider>  */}
  </React.StrictMode>
);

reportWebVitals();
