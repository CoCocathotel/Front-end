import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Logo from "../cococat-hotel.png";
import LoadingSpinner from "./Loading";

export default function Register() {
  // http://localhost:8700/v1/login
  const [email, setEmail] = useState("");
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function production_check() {
    const isDevelopment =
      window.location.origin.includes("localhost") ||
      window.location.origin.includes("127.0.0.1");

    return isDevelopment
      ? "http://localhost:8700"
      : "https://cococatbackend.vercel.app";
  }

  const handleLogin = async () => {
    try {
      const response = await fetch(production_check() + "/v1/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, first_name, last_name }),
      });
      const result = await response.json();

      if (result.err != "") {
        localStorage.setItem("user-provider", JSON.stringify(result));
        localStorage.setItem("token", result.token);
        navigate("/");
        console.log("Register and Login successful");
      } else {
        console.log("Register failed");
      }
    } catch (err) {
      console.log("An error occurred. Please try again.");
    }
  };
 
  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-200">
          <div className="bg-white p-5 rounded-lg shadow-lg">
            <div className="justify-center flex">
              <img src={Logo} alt="Logo" width={200} height={200} />
            </div>


            <div className="m-5">
              <input
                className="max-w-max bg-slate-100 rounded-lg p-2 text-black"
                type="first_name"
                placeholder="first_name"
                value={first_name}
                onChange={(e) => setFirst_name(e.target.value)}
              />
            </div>

            <div className="m-5">
              <input
                className="max-w-max bg-slate-100 rounded-lg p-2 text-black"
                type="last_name"
                placeholder="last_name"
                value={last_name}
                onChange={(e) => setLast_name(e.target.value)}
              />
            </div>

            <div className="m-5 flex">
              <input
                className="max-w-max bg-slate-100 rounded-lg p-2 text-black"
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="m-5">
              <input
                className="max-w-max bg-slate-100 rounded-lg p-2 text-black"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              className="w-48 py-2 px-2 mt-5 mb-5 mr-5 ml-5 items-center text-center bg-blue-500 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
              onClick={handleLogin}
            >
              Register  
            </button>

            <div className="mt-5 ml-5 mr-5 flex text-xs">
              <p className="text-gray-600">มีบัญชีผู้ใช้งานอยู่แล้ว </p>
              
              <a className="text-blue-700 ml-2 underline" href="/login">Login</a>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
