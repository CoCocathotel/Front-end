import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8700/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      localStorage.setItem("data", JSON.stringify(result));
      navigate("/");
      console.log("Login successful");
    } catch (err) {
      console.log("An error occurred. Please try again.");
    }
  }

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('data'));

    if (token) {
      navigate('/');
    }
    }, [navigate]);

  return (
    <div>
      <h1>Login</h1>
      <label>Username</label>
      <input type="text" value={email} onChange={(e) => { setEmail(e.target.value) }} />
      <label>Password</label>
      <input type="password" value={password} onChange={(e) => { setPassword(e.target.value) }} />
      <button onClick={handleLogin}>Submit</button>
    </div>
  );
}
