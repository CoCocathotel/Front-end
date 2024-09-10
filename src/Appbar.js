import { Route, Routes, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { DatePicker, Space } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import moment from "moment-timezone";
import Logo from "./cococat-hotel.png";
import "./App.css";

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

  dayjs.extend(customParseFormat);

  const { RangePicker } = DatePicker;
  const dateFormat = "YYYY-MM-DD";
  const timezone = "Asia/Bangkok";

  const formatDate = (date) => {
    return date.format("ddd, DD MMM-YYYY");
  };

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
    <div className="items-center justify-center  h-auto bg-white-50 text-center px-4 py-5">
      <div className=" ">
        <div className="flex items-center justify-center h-20 ">
          <div className="flex rounded-lg h-12 bg-gray-100 items-center justify-center ">
            <img src={Logo} alt="Logo" className="w-12 h-12 mr-4 " />
          <Space direction="vertical" size={12}>
          <RangePicker
              className="ml-7 hover:text-[#2D3DDF]  "
              picker="date"
              suffixIcon={null}
              defaultValue={[
                dayjs(startDate, dateFormat),
                dayjs(endDate, dateFormat),
              ]}
              onChange={(dates) => {
                if (dates) {
                  setStartDate(dates[0].format(dateFormat));
                  setEndDate(dates[1].format(dateFormat));
                }
              }}
              format={formatDate}
              renderExtraFooter={() => null}
              bordered={false}
              placeholder={["Start Date", "End Date"]}
            />
          </Space>
          </div>
        </div>
        <div>
          <div className=" items-center text-center flex space-x-20 justify-center mb-4">
            <div className="items-center text-center justify-center flex">
              <div className="w-56 flex mt-4 items-center bg-gray-100 space-x-1 rounded-lg">
                <img src={Logo} alt="Logo" className="w-12 h-12 " />
                <input
                  className="text-center bg-gray-100 w-20"
                  type="text"
                  // width = "10px"
                  readOnly
                  value={numcat}
                  onChange={(e) => setNumcat(e.target.value)}
                />
                <button
                  className="w-12 h-12 bg-blue-400 rounded-lg text-white"
                  onClick={Decreaments}
                >
                  -
                </button>
                <button
                  className="w-12 h-12 bg-blue-400 rounded-lg text-white"
                  onClick={Increment}
                >
                  +
                </button>
              </div>
            </div>
            <div className="items-center text-center justify-center flex ">
              <div className="w-56 flex mt-4 items-center bg-gray-100 space-x-1 rounded-lg">
                <img src={Logo} alt="Logo" className="w-12 h-12 " />
                <input
                  className="text-center bg-gray-100 w-20"
                  type="text"
                  // width = "10px"
                  readOnly
                  value={numcamera}
                  onChange={(e) => setNumcamera(e.target.value)}
                />
                <button
                  className="w-12 h-12 bg-blue-400 rounded-lg text-white"
                  onClick={Decreaments_cam}
                >
                  -
                </button>
                <button
                  className="w-12 h-12 bg-blue-400 rounded-lg text-white"
                  onClick={Increment_cam}
                >
                  +
                </button>
              </div>
            </div>
            <button
              className="mt-5 bg-blue-400 w-32 h-12 rounded-lg text-white"
              onClick={handlePageChange}
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
