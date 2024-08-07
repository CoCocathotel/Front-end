import { Route, Routes, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

   

export default function AppPay({ handleChange }) {
  const [data, setData] = useState([]);
  
  const handleHome = (e) => {
    handleChange(e);
  }

  const Logout = () => {
    localStorage.removeItem("data");
    setData(null);
  }

  return (
    <div className="App">
      {/* <h1>Blog Posts</h1> */}

      <div className="Time">
        {/* handleget */}
        <Link to="/">
          <button onClick={() => { handleHome(0) }}>Home</button>
        </Link>
        <div>
          {data && data ? (
            <>
              <p> {data.first_name} </p>
              <Link to="/">
                <button onClick={Logout}>Logout</button>  
              </Link>
            </>
          ) : (
            <Link to="/login">
            <button>Login</button>
          </Link>
          )}
        </div>
      </div>
    </div>
  );
}
