import { Route, Routes, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { DatePicker, Space } from "antd";
import { Popover, Button, Form, InputNumber, Row, Col } from "antd";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import InsertInvitationOutlinedIcon from "@mui/icons-material/InsertInvitationOutlined";
import '../App.css';
import moment from "moment-timezone";
import Cat01 from "../assets/image/cat01.png"

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

  const [visible, setVisible] = useState(false);

  const handleVisibleChange = (visible) => {
    setVisible(visible);
  };

  useEffect(() => {
    savetolocal_numcat(numcat);
    savetolocal(startDate, endDate);
    savetolocal_numcamera(numcamera);
    handlePageChange();
  }, [numcamera, numcat, startDate, endDate]);

  const content = (
    <Form
      layout=""
      className="flex flex-col items-center justify-center text-center"
    >
      <Col gutter={16} className="w-full max-w-2xl">
        <div className=" justify-center space-x-8">
          <div></div>
          <Col span={8}>
            <Form.Item name="Cat" label="แมว" initialValue={1}>
              <div className="flex items-center space-x-2">
                <Button
                  className="bg-[#16305C]  text-white w-10 h-10 rounded-full text-2xl font-semibold"
                  type="text"
                  onClick={Decreaments}
                >
                  -
                </Button>
                <input
                  type="text"
                  value={numcat}
                  className="text-center border-gray-200 w-20 font-semibold text-lg"
                />
                <Button
                  className="bg-[#16305C] text-white w-10 h-10 rounded-full text-2xl font-semibold"
                  type="text"
                  onClick={Increment}
                >
                  +
                </Button>
              </div>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="Camera" label="กล้อง" initialValue={0}>
              <div className="flex items-center space-x-2">
                <Button
                  className="bg-[#16305C] text-white w-10 h-10 rounded-full text-2xl font-semibold"
                  type="text"
                  onClick={Decreaments_cam}
                >
                  -
                </Button>
                <input
                  type="text"
                  value={numcamera}
                  className="text-center border-gray-200 w-20 font-semibold text-lg"
                />
                <Button
                  className="bg-[#16305C] text-white w-10 h-10 rounded-full text-2xl font-semibold"
                  type="text"
                  onClick={Increment_cam}
                >
                  +
                </Button>
              </div>
            </Form.Item>
          </Col>
        </div>

        <Form.Item className="">
          <button
            className="bg-[#16305C] hover:bg-[#A2A7A7] text-white rounded-lg border-2 border-opacity-80 shadow-lg px-8 py-2"
            // type="primary"
            // htmlType="submit"
            onClick={() => {
              setVisible(false);
            }}
          >
            ยืนยัน
          </button>
        </Form.Item>
      </Col>
    </Form>
  );

return (
  <div className="items-center w-full bg-[#EAEDF1] flex flex-col md:flex-row justify-center h-auto md:h-96 p-4 relative">
    <img
      src={Cat01}
      alt="23"
      className="absolute object-cover z-0 w-full h-40 md:h-60 filter blur-3xl from-teal-400 to-blue-500 hover:from-purple-500 hover:to-blue-500"
    />
    <div className="flex flex-col items-center justify-center h-auto md:h-56 rounded-2xl bg-[#fff8f8] shadow-lg z-10 w-full md:w-3/4 lg:w-1/2 border-2 px-6 py-8">
      <h1 className="text-2xl md:text-4xl text-[#2757A6] font-semibold mb-6">
        จองห้องพัก
      </h1>
      <div className="flex flex-col md:flex-row items-center justify-center w-full space-y-4 md:space-y-0 md:space-x-4">
        <div className="border h-12 flex items-center px-4 py-2 w-full md:w-80 bg-white rounded-md border-[#A2A7A7] shadow-md hover:text-[#A2A7A7]">
          <InsertInvitationOutlinedIcon />
          <RangePicker
  suffixIcon={null}
  className="ml-2 w-full"
  picker="date"
  dropdownClassName="custom-calendar-dropdown" // เพิ่มคลาสที่กำหนดเอง
  defaultValue={[
    dayjs(startDate, dateFormat),
    dayjs(endDate, dateFormat),
  ]}
  onChange={(date, dateString) => {
    setStartDate(dateString[0]);
    setEndDate(dateString[1]);
  }}
  disabledDate={(current) => {
    return current && current < dayjs().startOf("day");
  }}
  renderExtraFooter={() => null}
  bordered={false}
  placeholder={["เช็คอิน", "เช็คเอาท์"]}
/>
        </div>
        <Popover
          content={content}
          title="รายละเอียดการจอง"
          trigger="click"
          visible={visible}
          onVisibleChange={handleVisibleChange}
        >
          <div className="border h-12 flex items-center px-4 py-2 w-full md:w-80 bg-white rounded-md border-[#A2A7A7] shadow-md hover:text-[#A2A7A7] cursor-pointer">
            <GroupOutlinedIcon />
            <span className="ml-2">
              {numcat} {"แมว"} {" - "} {numcamera} {"กล้อง"}
            </span>
          </div>
        </Popover>
      </div>
    </div>
  </div>
);

}




{/* <button
            className="h-10 flex items-center px-4 py-2 w-full md:w-32 text-center justify-center rounded-lg shadow-md hover:bg-[#dddfe3] bg-[#16305C] text-white"
            onClick={handlePageChange}
          >
            ค้นหา
          </button> */}