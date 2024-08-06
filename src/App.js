import { Route, Routes, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
 

export default function App({ handleChange }) {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [numcat, setNumcat] = useState(1);

  const handlePageChange = (e) => {
    handleChange({ startDate, endDate, numcat });
  }
  const handleHome = (e) => {
    handleChange(e);
  }

  const Logout = () => {
    localStorage.removeItem("data");
    setData(null);
  }

  useEffect(() => {
    let get_res = localStorage.getItem("data");
    // console.log(result);
    let result = JSON.parse(get_res);
    setData(result);
    console.log(result);  
    // console.log(result.first_name);
    // let token = result.token;
    // console.log(token);
  }, []);
  

  return (
    <div className="App">
      {/* <h1>Blog Posts</h1> */}

      <div className="Time">
        {/* handleget */}
        <Link to="/">
          <button onClick={() => { handleHome(0) }}>Home</button>
        </Link>
        <div>
          <DatePicker
            showIcon
            selected={startDate}
            dateFormat="dd/MM/yyyy"
            onChange={(date) => setStartDate(date)}
          />
        </div>
        <div>
          <DatePicker
            showIcon
            selected={endDate}
            dateFormat="dd/MM/yyyy"
            onChange={(date) => setEndDate(date)}
          />
        </div>
        <div>
          <label>จำนวนแมว</label>
          {/* dropdown numcat */}
          <select
            value={numcat}
            onChange={(e) => setNumcat(e.target.value)}
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>

          </select>
        </div>
        <div>
          <button onClick={handlePageChange}>ค้นหา</button>
        </div>
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
