import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../cococat-hotel.png";
import LoadingSpinner from "../../component/Loading";
import api from "../../utils/api";

export default function Login({ handleAppbar }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // ป้องกันการ submit form แบบปกติ
    setLoading(true);
    setErrorMessage(""); // รีเซ็ตข้อความ error ก่อนส่งข้อมูล

    api.userLogin({ email, password })
      .then((response) => {
        const result = response.data;
        if (result.err) {
          setErrorMessage("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
          setLoading(false); // หยุดโหลดเมื่อเจอ error
        } else {
          handle_value();
          localStorage.setItem("user-provider", JSON.stringify(result));
          localStorage.setItem("token", result.token);
          navigate("/");
          if (result.pos === "admin") {
            window.location.reload();
          }
        }
      })
      .catch((err) => {
        console.error("An error occurred. Please try again.", err);
        setErrorMessage("email หรือ password ของคุณผิดกรุณาใส่รหัสใหม่อีกครั้ง");
        setLoading(false); // หยุดโหลดเมื่อเกิดข้อผิดพลาด
      });
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
        <div className="flex flex-col items-center justify-center">
          <div className="w-full max-w-md">
            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="grid grid-cols-1 gap-4">
                <label className="text-left" htmlFor="email">อีเมล</label>
                <input
                  id="email"
                  name="email"
                  className="w-full bg-slate-100 rounded-lg p-2 text-black"
                  type="text"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <label className="text-left" htmlFor="password">รหัสผ่าน</label>
                <input
                  id="password"
                  name="password"
                  className="w-full bg-slate-100 rounded-lg p-2 text-black"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {errorMessage && (
                <p className="text-red-500 text-center">{errorMessage}</p>
              )}

              <button
                type="submit"
                className="w-full py-2 px-4 mt-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
