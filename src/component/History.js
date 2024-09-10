import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Logo from "../cococat-hotel.png";
import Img_bg from "../cococat_preview.jpg";
import LoadingSpinner from "./Loading";
import Appbar_master from "../Appbar_master";

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
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const { RangePicker } = DatePicker;
  const timezone = "Asia/Bangkok";
  const dateFormat = "YYYY-MM-DD";

  const formatDate = (date) => {
    return date.format("ddd ,DD MMM-YYYY");
  };

  const [data, setData] = useState([]);

  const handleCloseLogin = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user-provider");
    // window.location.reload();
    navigate("/login");
    setAnchorEl(null);
  };

  const handleCloseLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user-provider");
    window.location.reload();
    setAnchorEl(null);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const fecthdata = async () => {
    try {
      const response = await fetch("https://cococatbackend.vercel.app/v1/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          email: JSON.parse(localStorage.getItem("user-provider")).email,
        }),
      });
      const result = await response.json();
      console.log(result);
      setData(result.body);
      setLoading(false);
    } catch (err) {
      console.log("An error occurred. Please try again.");
    }
  };

  //   check_in_date
  // :
  // "2024-08-23T01:31:57.000Z"
  // check_out_date
  // :
  // "2024-08-24T01:31:57.000Z"
  // email
  // :
  // "vs@mail.com"
  // image
  // :
  // "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAA
  // optional_services
  // :
  // []
  // pay_way
  // :
  // "credit"
  // phone
  // :
  // "08122131"
  // room_name
  // :
  // "Fan Room"
  // special_request
  // :
  // "ขอกระบะทราย มีน่ำ มีข้าวพร้อม"
  // status
  // :
  // "pending"
  // total_cameras
  // :
  // 1
  // total_cats
  // :
  // 1
  // total_price
  // :
  // 100
  // total_rooms
  // :
  // 1
  // type
  // :
  // "fan-room"

  useEffect(() => {
    let get_user = JSON.parse(localStorage.getItem("user-provider"));

    if (get_user === null || get_user === "") {
      navigate("/login");
    } else {
      fecthdata();
    }
  }, []);

  return (
    <>
      {loading ? (
        <div>
          <LoadingSpinner />
        </div>
      ) : (
        <div className="bg-gray-200  flex flex-col ">
            <Appbar_master />

          {data.map((item, index) => (
            <div
              className="flex flex-col items-center justify-around  px-4 py-5 w-full h-auto "
              key={item._id}
            >
              <div className="bg-white p-5 justify-between rounded-lg shadow-lg flex  w-1/2 h-44">
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
                        รายละเอียดเพิ่มเติม: {item.special_request.slice(0, 20)}...
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
          ))}
          <footer className=" bg-[#8CAFCB] p-14  items-center justify-between text-center shadow-lg w-full bottom-0 h-auto">
            <h1 className="text-3xl text-left text-white">ติดต่อเรา</h1>
            <div className="flex  text-white justify-between   mt-2 mb-10">
              <div className=" text-left">
                <div>
                  <p>Adress</p>
                  <p>
                    121, 105 3 Ban Tungree, Kho Hong, Hat Yai District, Songkhla
                    90110
                  </p>
                </div>
              </div>
              <div className=" text-white text-left  items-end justify-end">
                <p>โทร : 065-384-5659</p>
                <p>Line : https://lin.ee/8OFTOx2l(@cococathotel)IG</p>
                <p>Tiktok : cococat.hotelTiktok: cococat.hotel</p>
              </div>
            </div>
            <hr />
            <h1 className="text-left text-white p-5">
              © 2023 All rights Reserved.
            </h1>
          </footer>
        </div>
      )}
    </>
  );
}
