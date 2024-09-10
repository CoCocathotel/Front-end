import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Logo from "../cococat-hotel.png";
import Img_bg from "../cococat_preview.jpg";
import LoadingSpinner from "../component/Loading";
import Appbar from "../Appbar";

import DragIndicatorOutlinedIcon from '@mui/icons-material/DragIndicatorOutlined';
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import Appbar_master from "../Appbar_master";
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
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import SendIcon from "@mui/icons-material/Send";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import { DatePicker, Space } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import moment from "moment-timezone";

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

import Tooltip from "@mui/material/Tooltip";

import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import EmailTwoToneIcon from "@mui/icons-material/EmailTwoTone";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";

export default function Ad_Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const [data, setData] = useState([]);

  dayjs.extend(customParseFormat);

  const { RangePicker } = DatePicker;
  const timezone = "Asia/Bangkok";
  const dateFormat = "YYYY-MM-DD";

  const formatDate = (date) => {
    return date.format("DD MMM-YYYY");
  };

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
      const response = await fetch("http://localhost:8700/v1/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          email: JSON.parse(localStorage.getItem("user-provider")).email,
          pos: "admin",
        }),
      });
      const result = await response.json();
      console.log(result, "admin");
      setData(result.body);
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
    fecthdata();
    setLoading(false);
  }, []);

  const changeStatus = async (id, status) => {
    try {
      const response = await fetch("http://localhost:8700/v1/update-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          id: id,
          status: status,
        }),
      });
      const result = await response.json();
      console.log(result);
      fecthdata();
    } catch (err) {
      console.log("An error occurred. Please try again.");
    }
  };

  return (
    <>
      {loading ? (
        <div>
          <LoadingSpinner />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="sticky top-0 bg-white z-50">
            <Appbar_master />
          </div>

          <div className="p-4">
            {/* Header Row */}
            <div className="grid grid-cols-12 gap-1 text-center mb-4">
              {[
                "จัดการห้อง",
                "ห้อง",
                "วันที่เช็คอิน",
                "วันที่เช็คเอาท์",
                "สถานะ",
                "สลิปโอนเงิน",
                "อีเมล",
                "เบอร์โทร",
                "ราคาทั้งหมด",
                "จำนวนแมว",
                "จำนวนกล้อง",
                "คำขอพิเศษ",
              ].map((header) => (
                <h1 key={header} className="font-bold text-sm">
                  {header}
                </h1>
              ))}
            </div>

            {/* Data Rows */}
            {data.map((item) => (
              <div
                key={item._id}
                className="grid grid-cols-12 gap-4 p-4 text-center text-sm mb-4 border-b border-gray-300"
              >
                {/* <div className="flex justify-center space-x-2">
                  {["pass", "pending", "failed"].map((status) => (
                    <button
                      key={status}
                      onClick={() => changeStatus(item._id, status)}
                      className={`w-5 h-5 ${
                        status === "pass"
                          ? "bg-green-400"
                          : status === "pending"
                          ? "bg-yellow-400"
                          : "bg-red-400"
                      }`}
                    />
                  ))}
                </div>  */}

                <div className="flex justify-center h-5 items-center space-x-1 ">
                <button className="col-span-1 hover:bg-gray-50 rounded-lg bg-yellow-300 h-10 w-10 "><ModeEditOutlinedIcon /></button>
                <button className="col-span-1 hover:bg-gray-50 rounded-lg bg-blue-300 h-10 w-10 "><AddOutlinedIcon /></button>
                <div className="col-span-1 hover:bg-gray-50 rounded-lg bg-green-300">
                  <PopupState variant="popover" popupId="demo-popup-menu">
                    {(popupState) => (
                      <React.Fragment>
                        <IconButton
                          aria-label="more"
                          {...bindTrigger(popupState)}
                        >
                          <DragIndicatorOutlinedIcon />
                        </IconButton>
                        <Menu
                          {...bindMenu(popupState)} 
                          PaperProps={{
                            style: {
                              maxHeight: 48 * 4.5,
                              width: "10ch",
                            },
                          }}
                        >
                          <MenuItem
                            onClick={() => {
                              changeStatus(item._id, "pass");
                              popupState.close();
                            }}
                          >
                        
                            <Typography variant="inherit">pass</Typography>
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              changeStatus(item._id, "pending");
                              popupState.close();
                            }}
                          >
                    
                            <Typography variant="inherit">pending</Typography>
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              changeStatus(item._id, "failed");
                              popupState.close();
                            }}
                          >
                           
                            <Typography variant="inherit">failed</Typography>
                          </MenuItem>
                        </Menu>
                      </React.Fragment>
                    )}
                  </PopupState>
                </div>
                </div>

                <div className="col-span-11 grid grid-cols-11 gap-4">
                  <Tooltip title={item.room_name} arrow>
                    <span className="truncate ...">{item.room_name}</span>
                  </Tooltip>
                  <Tooltip title={formatDate(dayjs(item.check_in_date))} arrow>
                    <span>{formatDate(dayjs(item.check_in_date))}</span>
                  </Tooltip>
                  <Tooltip title={formatDate(dayjs(item.check_out_date))} arrow>
                    <span>{formatDate(dayjs(item.check_out_date))}</span>
                  </Tooltip>
                  <Tooltip title={item.status} arrow>
                    <span>{item.status}</span>
                  </Tooltip>
                  <Tooltip title={
       
                    <img src={item.image} alt="slip" width={100} height={100} />

                  } arrow>
                    <span>{item.pay_way}</span>
                  </Tooltip>
                  <Tooltip title={item.email} arrow>
                    <span className="truncate ...">{item.email}</span>
                  </Tooltip>
                  <Tooltip title={item.phone} arrow>
                    <span className="truncate ...">{item.phone}</span>
                  </Tooltip>
                  <Tooltip title={item.total_price} arrow>
                    <span>{item.total_price}</span>
                  </Tooltip>
                  <Tooltip title={item.total_cats} arrow>
                    <span>{item.total_cats}</span>
                  </Tooltip>
                  <Tooltip title={item.total_cameras} arrow>
                    <span>{item.total_cameras}</span>
                  </Tooltip>
                  <Tooltip title={item.special_request} arrow>
                    <span className="truncate ...">{item.special_request}</span>
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
