import React, { useState } from "react";
import LoadingSpinner from "../../component/Loading";
import api from "../../utils/api";

export default function Register({ handleAppbar }) {
  const [email, setEmail] = useState("");
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to check password strength
  const isPasswordStrong = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  };

  const handleLogin = async () => {
    setError(""); // Clear previous errors

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Check if password is strong enough
    if (!isPasswordStrong(password)) {
      setError("Password must be at least 8 characters long, contain uppercase, lowercase, number, and special character");
      return;
    }

    // Check if email already exists
    try {
      setLoading(true);
      const emailCheckResponse = await api.checkEmailExists(email);
      if (emailCheckResponse.data.exists) {
        setError("Email is already registered");
        setLoading(false);
        return;
      }
    } catch (err) {
      setError("Error checking email availability");
      setLoading(false);
      return;
    }

    // Proceed with registration
    api.userRegister({ email, password, first_name, last_name })
      .then((response) => {
        const result = response.data;
        if (result.err !== "") {
          localStorage.setItem("user-provider", JSON.stringify(result));
          localStorage.setItem("token", result.token);
          window.location.href = '/';
          console.log("Register and Login successful");
        }
      })
      .catch((err) => {
        console.log("An error occurred. Please try again.", err);
        setError("Registration failed. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="flex flex-col items-center justify-center">
          <div className="p-6 w-full max-w-md">
            <div className="space-y-6">
              {/* Registration fields */}
              <div className="grid grid-cols-1 gap-4">
                <label className="text-left">ชื่อ</label>
                <input
                  className="w-full bg-slate-100 rounded-lg p-2 text-black"
                  type="text"
                  placeholder="First Name"
                  value={first_name}
                  onChange={(e) => setFirst_name(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 gap-4">
                <label className="text-left">นามสกุล</label>
                <input
                  className="w-full bg-slate-100 rounded-lg p-2 text-black"
                  type="text"
                  placeholder="Last Name"
                  value={last_name}
                  onChange={(e) => setLast_name(e.target.value)}
                />
              </div>
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
              <div className="grid grid-cols-1 gap-4">
                <label className="text-left">ยืนยันรหัสผ่าน</label>
                <input
                  className="w-full bg-slate-100 rounded-lg p-2 text-black"
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              {/* Display error messages */}
              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                onClick={handleLogin}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
