import { Route, Routes, Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function App({ handleChange, SetStartDate, SetEndDate }) {
  const ref = useRef({ startDate: new Date(), endDate: new Date(), numcat: 1 });
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState(ref.current.startDate);
  const [endDate, setEndDate] = useState(ref.current.endDate);
  const [numcat, setNumcat] = useState(ref.current.numcat);

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
    const get_res = localStorage.getItem("data");
    if (get_res) {
      const result = JSON.parse(get_res);
      setData(result);
      console.log(result);
    }
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      ref.current = { startDate, endDate, numcat };
      // console.log(ref.current);
    }
  }, [startDate, endDate, numcat]);

  // ใช้ useEffect เพื่ออัปเดต state จาก props
  useEffect(() => {
    if (SetStartDate) {
      setStartDate(SetStartDate);
    }
    if (SetEndDate) {
      setEndDate(SetEndDate);
    }
  }, [SetStartDate, SetEndDate]);

  return (
    <div className="App">
      <div className="Time">
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
          <select
            value={numcat}
            onChange={(e) => setNumcat(Number(e.target.value))}
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
          {data ? (
            <>
              <p>{data.first_name}</p>
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
