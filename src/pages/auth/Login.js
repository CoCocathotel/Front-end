import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Logo from "../../cococat-hotel.png";
import LoadingSpinner from "../../component/Loading";
import axios from 'axios';


export default function Login({ handleAppbar }) {
  // http://localhost:8700/v1/login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const value_x = false;
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
    handle_value2();
    try {
      const response = await axios.post(production_check() + "/v1/login", {
        email,
        password,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      const result = response.data;

      if (result.err !== "") {
        handle_value();
        localStorage.setItem("user-provider", JSON.stringify(result));
        localStorage.setItem("token", result.token);

        if (result.pos === "admin") {
          window.location.reload();
        } else {
          navigate("/");
        }

        console.log("Login successful");
      } else {
        console.log("Login failed");
      }
    } catch (err) {
      console.log("An error occurred. Please try again.", err);
    }
  };

  const handle_value = () => {
    handleAppbar(false);
  };

  const handle_value2 = () => {
    handleAppbar(true);
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="flex flex-col items-center justify-center ">
          <div className=" w-full max-w-md">
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <label className="text-left">อีเมล</label>
                <input
                  className="w-full bg-slate-100 rounded-lg p-2 text-black"
                  type="text"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <label className="text-left">รหัสผ่าน</label>
                <input
                  className="w-full bg-slate-100 rounded-lg p-2 text-black"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                className="w-full py-2 px-4 mt-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                onClick={handleLogin}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
