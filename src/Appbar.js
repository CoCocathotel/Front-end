import { Route, Routes, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { DatePicker, Space } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import moment from "moment-timezone";

dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";
const timezone = 'Asia/Bangkok';

export default function Appbar() {
  const [nunmcat, setNumcat] = useState(
    parseInt(JSON.parse(localStorage.getItem("number_of_cats"))) || 1
  );
  const [startDate, setStartDate] = useState(
    localStorage.getItem("startDate") || moment.tz(timezone).format()
  );

  const today = new Date();

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const [endDate, setEndDate] = useState(
    localStorage.getItem("endDate") || moment.tz(timezone).add(1, 'day').format());

  const savetolocal = (start, end) => {
    localStorage.setItem("startDate", start);
    localStorage.setItem("endDate", end);
  };
  const savetolocal_numcat = (numcat) => {
    localStorage.setItem("number_of_cats", JSON.stringify(nunmcat));
  };
  const Increment = () => {
    setNumcat(nunmcat + 1);
  };
  const Decreaments = () => {
    if (nunmcat <= 1) {
      setNumcat(1);
    } else {
      setNumcat(nunmcat - 1);
    }
  };

  useEffect(() => {
    savetolocal_numcat(nunmcat);
    savetolocal(startDate, endDate);
  }, [nunmcat, startDate, endDate]);

  return (
    <div>
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

      <input
        type="text"
        value={nunmcat}
        onChange={(e) => setNumcat(e.target.value)}
      />
      <button onClick={Decreaments}>-</button>
      <button onClick={Increment}>+</button>
    </div>
  );
}
