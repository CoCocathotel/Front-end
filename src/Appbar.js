import { Route, Routes, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { DatePicker, Space } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import moment from "moment-timezone";
import "./App.css";

dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";
const timezone = "Asia/Bangkok";

export default function Appbar({ handleAppbar }) {
  const [numcat, setNumcat] = useState(
    parseInt(JSON.parse(localStorage.getItem("number_of_cats"))) || 1
  );
  const [numcamera, setNumcamera] = useState(
    parseInt(JSON.parse(localStorage.getItem("number_of_cameras"))) || 0
  );
  const [startDate, setStartDate] = useState(
    localStorage.getItem("startDate") || moment.tz(timezone).format()
  );

  const today = new Date();

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const [endDate, setEndDate] = useState(
    localStorage.getItem("endDate") ||
    moment.tz(timezone).add(1, "day").format()
  );
  const handlePageChange = (e) => {
    handleAppbar({ startDate, endDate, numcat, numcamera });
  };
  const savetolocal = (start, end) => {
    localStorage.setItem("startDate", start);
    localStorage.setItem("endDate", end);
  };
  const savetolocal_numcat = (numcat) => {
    localStorage.setItem("number_of_cats", JSON.stringify(numcat));
  };

  const savetolocal_numcamera = (numcamera) => {
    localStorage.setItem("number_of_cameras", JSON.stringify(numcamera));
  };

  const Increment_cam = () => {
    setNumcamera(numcamera + 1);
  };

  const Decreaments_cam = () => {
    if (numcamera <= 0) {
      setNumcamera(0);
    } else {
      setNumcamera(numcamera - 1);
    }
  };

  const Increment = () => {
    setNumcat(numcat + 1);
  };
  const Decreaments = () => {
    if (numcat <= 1) {
      setNumcat(1);
    } else {
      setNumcat(numcat - 1);
    }
  };

  useEffect(() => {
    savetolocal_numcat(numcat);
    savetolocal(startDate, endDate);
    savetolocal_numcamera(numcamera);
    handlePageChange();
  }, [numcamera, numcat, startDate, endDate]);

  return (
    <div className="app-bar">
      <Space direction="vertical" size={12}>
        <RangePicker
          picker="date"
          defaultValue={[
            dayjs(startDate, dateFormat),
            dayjs(endDate, dateFormat),
          ]}
          onChange={(date, dateString) => {
            // parse datestring to date
            setStartDate(dateString[0]);
            setEndDate(dateString[1]);
          }}
          onFocus={(_, info) => {
            // console.log("Focus:", info.range);
          }}
          onBlur={(_, info) => {
            // console.log("Blur:", info.range);
          }}
        />
      </Space>

      <div className="font-text">
        
      จำนวนแมว : <input className="input-primary"
        type="text"
        value={numcat}
        onChange={(e) => setNumcat(e.target.value)}
      />
      <button className="btn-primary2" onClick={Decreaments}>-</button>
      <button  className="btn-primary2"onClick={Increment}>+</button>

      จำนวนกล้อง : <input className="input-primary"
        type="text"
        value={numcamera}
        onChange={(e) => setNumcamera(e.target.value)}
      />
      <button className="btn-primary2" onClick={Decreaments_cam}>-</button>
      <button className="btn-primary2" onClick={Increment_cam}>+</button>
      </div>

    </div>
  );
}
