import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../../component/Sidebar";
import Logo from "../../cococat-hotel.png";
import Img_bg from "../../cococat_preview.jpg";
import LoadingSpinner from "../../component/Loading";
import Appbar_master from "../../component/AppbarMaster";

import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import EmailTwoToneIcon from "@mui/icons-material/EmailTwoTone";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";

import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import SendIcon from "@mui/icons-material/Send";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";

import { DatePicker, Space } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import moment from "moment-timezone";

export default function Cart() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [boxid, setBoxID] = useState(0);
  const [status, setStatus] = useState("");
  const open = Boolean(anchorEl);

  const { RangePicker } = DatePicker;
  const timezone = "Asia/Bangkok";
  const dateFormat = "YYYY-MM-DD";

  const formatDate = (date) => {
    return date.format("ddd ,DD MMM-YYYY");
  };

  const [data, setData] = useState([]);

  function productionCheck() {
    const isDevelopment =
      window.location.origin.includes("localhost") ||
      window.location.origin.includes("127.0.0.1");

    return isDevelopment
      ? "http://localhost:8700"
      : "https://cococatbackend.vercel.app";
  }


  const fecthdata = async () => {
    try {
      const response = await fetch(
        productionCheck()+"/v1/cart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // 'Access-Control-Allow-Origin': '*',
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({
            email: JSON.parse(localStorage.getItem("user-provider")).email,
          }),
        }
      );
      const result = await response.json();
      console.log(result);
      setData(result.body);
      setLoading(false);
    } catch (err) {
      console.log("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    let get_user = JSON.parse(localStorage.getItem("user-provider"));
    if (get_user === null || get_user === "") {
      window.onload.herf('/')
    } else {
      fecthdata();
    }
  }, []);

  let data_information =
    status != "" ? data.filter((data) => data.status === status) : data;

  return (
    <>
      {loading ? (
        <div className="bg-gray-200">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="">
          {/* <Appbar_master /> */}
          <div
            className={`bg-gray-200  flex flex-col  items-center ${
              data_information.length >= 3 ? "h-auto" : "h-screen"
            }`}
          >
            <div className="flex flex-row justify-around bg-white items-center w-1/2 h-20 mt-5 px-4 py-5 z-0 rounded-lg shadow-lg ">
              <button
                onClick={(_) => {
                  setBoxID(0);
                  setStatus("");
                }}
                className={`h-20 w-full ${
                  boxid == 0 ? " text-blue-500 border-b-2 border-blue-400" : ""
                }`}
              >
                ทั้งหมด
              </button>
              <button
                onClick={(_) => {
                  setBoxID(1);
                  setStatus("pending");
                }}
                className={`h-20 w-full ${
                  boxid == 1 ? " text-blue-500 border-b-2 border-blue-400" : ""
                }`}
              >
                กำลังตรวจสอบ
              </button>
              <button
                onClick={(_) => {
                  setBoxID(2);
                  setStatus("pass");
                }}
                className={`h-20 w-full ${
                  boxid == 2 ? " text-blue-500 border-b-2 border-blue-400" : ""
                }`}
              >
                สำเร็จ
              </button>
              <button
                onClick={(_) => {
                  setBoxID(3);
                  setStatus("failed");
                }}
                className={`h-20 w-full ${
                  boxid == 3 ? " text-blue-500 border-b-2 border-blue-400" : ""
                }`}
              >
                ยกเลิก
              </button>
            </div>
            {data_information.map((item) => (
              <div
                className="flex flex-col items-center justify-around  px-4 py-5 w-full h-auto "
                key={item._id}
              >
                <div className="bg-white p-5 justify-between rounded-lg shadow-lg flex w-1/2 h-48">
                  <div className=" text-sm flex space-x-8 items-end  ">
                    {/* {item.image !== "" ? (
                      <img src={item.image} alt="Logo" width={60} height={60} />
                    ) : (
                      <img src={Logo} alt="Logo" width={100} height={100} />
                    )} */}

                    <img
                      src={
                        "https://hiykwrlgoinmxgqczucv.supabase.co/storage/v1/object/public/rooms/" +
                        item.type +
                        "/" +
                        "0.png"
                      }
                      className="rounded-xl shadow-lg w-20 h-32 object-cover "
                      alt={item.type}
                      // width={80}
                      // height={80}
                    />

                    <div className="overflow-hidden ">
                      <Tooltip title={item.room_name} arrow>
                        <h1 className="text-lg">{item.room_name}</h1>
                      </Tooltip>
                      <Tooltip
                        title={`รายละเอียดเพิ่มเติม: ${item.special_request}`}
                        arrow
                      >
                        <span className="text-xs text-gray-400  ">
                          รายละเอียดเพิ่มเติม:{" "}
                          {item.special_request.slice(0, 20)}...
                        </span>
                      </Tooltip>
                      <Tooltip title={`ราคา: ${item.total_price} บาท`} arrow>
                        <h1 className="">ราคา: {item.total_price} บาท</h1>
                      </Tooltip>
                      <Tooltip title={`แมว: ${item.total_cats}`} arrow>
                        <h1>แมว: {item.total_cats}</h1>
                      </Tooltip>
                      <Tooltip title={`รูปแบบการชำระ: ${item.pay_way}`} arrow>
                        <h1>รูปแบบการชำระ: {item.pay_way}</h1>
                      </Tooltip>

                      
                     <div className="flex space-x-1 text-center items-center">
                     <h1>สถานะการชำเงิน: </h1>
                     {( item.status === "pending" ? (
                      <Tooltip title={item.status} arrow>
                        {/* <button className="bg-yellow-300 p-2 rounded-lg shadow-lg w-1/2"> */}
                          <h1 className="text-sm bg-yellow-300 p-1 rounded-lg shadow-lg">{item.status}</h1>
                        {/* </button> */}
                      </Tooltip>
                    ) : item.status === "pass" ? (
                      <Tooltip title={item.status} arrow>
                        {/* <button className="bg-green-300 p-2 rounded-lg shadow-lg w-1/2"> */}
                          <h1 className="text-sm bg-green-300 p-1 rounded-lg shadow-lg ">{item.status}</h1>
                        {/* </button> */}
                      </Tooltip>
                    ) : (
                      <Tooltip title={item.status} arrow>
                        {/* <button className="bg-red-300 p-2 rounded-lg shadow-lg w-1/2"> */}
                          <h1 className="text-sm bg-red-300 p-1 rounded-lg shadow-lg">{item.status}</h1>
                        {/* </button> */}
                      </Tooltip>
                    ))}
                      </div>
                    </div> 
                  </div>

                  <div className=" text-right grid grid-cols-1 gap-20 h-36">
                    <div>
                      <Tooltip
                        title={`วันที่เช็คอิน: ${formatDate(
                          dayjs(item.check_in_date)
                        )} - วันที่เช็คเอาท์: ${formatDate(
                          dayjs(item.check_out_date)
                        )}`}
                        arrow
                      >
                        <div className="flex text-xs text-gray-400">
                          <h1>{formatDate(dayjs(item.check_in_date))}</h1>
                          <h1>{" - "}</h1>
                          <h1>{formatDate(dayjs(item.check_out_date))}</h1>
                        </div>
                      </Tooltip>
                    </div>
                    {/* {item.status === "pending" ? (
                      <Tooltip title={item.status} arrow>
                        <button className="bg-yellow-300 p-2 rounded-lg shadow-lg w-1/2">
                          <h1 className="text-sm">{item.status}</h1>
                        </button>
                      </Tooltip>
                    ) : item.status === "pass" ? (
                      <Tooltip title={item.status} arrow>
                        <button className="bg-green-300 p-2 rounded-lg shadow-lg w-1/2">
                          <h1 className="text-sm">{item.status}</h1>
                        </button>
                      </Tooltip>
                    ) : (
                      <Tooltip title={item.status} arrow>
                        <button className="bg-red-300 p-2 rounded-lg shadow-lg w-1/2">
                          <h1 className="text-sm">{item.status}</h1>
                        </button>
                      </Tooltip>
                    )} */}
                    <div>
                      <Tooltip title={item.status} arrow>
                        <Link to={`/history/${item._id}`}>
                          <button className="hover:bg-[#A2A7A7] bg-[#55605B] text-white p-2  rounded-lg shadow-lg ">
                            <h1 className="text-sm">ดูรายละเอียด</h1>
                          </button>
                        </Link>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {/* {data.map((item, index) => (
              <div className="flex flex-col items-center justify-around  px-4 py-5 w-full h-auto " key={item._id}>
                <div className="bg-white p-5 justify-between rounded-lg shadow-lg flex w-1/2 h-44">
                  <div className="items-center text-sm flex space-x-8">
                    {item.image !== "" ? (
                      <img src={item.image} alt="Logo" width={60} height={60} />
                    ) : (
                      <img src={Logo} alt="Logo" width={100} height={100} />
                    )}
                    <div className="overflow-hidden ">
                      <Tooltip title={item.room_name} arrow>
                        <h1 className="text-lg">{item.room_name}</h1>
                      </Tooltip>
                      <Tooltip
                        title={`รายละเอียดเพิ่มเติม: ${item.special_request}`}
                        arrow
                      >
                        <span className="text-xs text-gray-400  ">
                          รายละเอียดเพิ่มเติม:{" "}
                          {item.special_request.slice(0, 20)}...
                        </span>
                      </Tooltip>
                      <Tooltip title={`ราคา: ${item.total_price} บาท`} arrow>
                        <h1 className="">ราคา: {item.total_price} บาท</h1>
                      </Tooltip>
                      <Tooltip title={`แมว: ${item.total_cats}`} arrow>
                        <h1>แมว: {item.total_cats}</h1>
                      </Tooltip>
                      <Tooltip title={`รูปแบบการชำระ: ${item.pay_way}`} arrow>
                        <h1>รูปแบบการชำระ: {item.pay_way}</h1>
                      </Tooltip>
                    </div>
                  </div>

                  <div className="justify-between space-y-20 text-right h-auto">
                    <Tooltip
                      title={`วันที่เช็คอิน: ${formatDate(
                        dayjs(item.check_in_date)
                      )} - วันที่เช็คเอาท์: ${formatDate(
                        dayjs(item.check_out_date)
                      )}`}
                      arrow
                    >
                      <div className="flex text-xs text-gray-400">
                        <h1>{formatDate(dayjs(item.check_in_date))}</h1>
                        <h1>{" - "}</h1>
                        <h1>{formatDate(dayjs(item.check_out_date))}</h1>
                      </div>
                    </Tooltip>

                    {item.status === "pending" ? (
                      <Tooltip title={item.status} arrow>
                        <button className="bg-yellow-300 p-2 rounded-lg shadow-lg w-1/2">
                          <h1 className="text-sm">{item.status}</h1>
                        </button>
                      </Tooltip>
                    ) : item.status === "pass" ? (
                      <Tooltip title={item.status} arrow>
                        <button className="bg-green-300 p-2 rounded-lg shadow-lg w-1/2">
                          <h1 className="text-sm">{item.status}</h1>
                        </button>
                      </Tooltip>
                    ) : (
                      <Tooltip title={item.status} arrow>
                        <button className="bg-red-300 p-2 rounded-lg shadow-lg w-1/2">
                          <h1 className="text-sm">{item.status}</h1>
                        </button>
                      </Tooltip>
                    )}
                  </div>
                </div>
              </div>
            ))} */}
          </div>
        </div>
      )}
    </>
  );
}
