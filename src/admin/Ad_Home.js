import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Logo from "../cococat-hotel.png";
import Img_bg from "../cococat_preview.jpg";
import LoadingSpinner from "../component/Loading";
import Appbar from "../Appbar";

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


import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
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
        <>
          <div className="sticky top-0 bg-white z-50">
            <div className="grid grid-cols-5 gap-1 p-4">
              <img
                className="ml-24"
                src={Logo}
                alt="logo"
                width={80}
                height={80}
              />
              <button
                onClick={() => {
                  navigate("/home");
                }}
                className="text-gray-600 hover:text-blue-500"
              >
                Home
              </button>
              <button
                onClick={() => {
                  navigate("/");
                }}
                className="text-gray-600 hover:text-blue-500"
              >
                Booking
              </button>
              <button
                onClick={() => {
                  navigate("/history");
                }}
                className="text-gray-600 hover:text-blue-500"
              >
                Order
              </button>
              {localStorage.getItem("token") ? (
                <>
                  {/* <button
                  className="ext-gray-600 hover:text-blue-500"
                  onClick={() => {
                    localStorage.removeItem("token");
                    window.location.reload();
                  }}
                >
                  Logout {" "} {JSON.parse(localStorage.getItem("user-provider")).email}
                </button> */}
                 <React.Fragment>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        textAlign: "center",
                      }}
                    >
                      {/* <Typography sx={{ minWidth: 100 }}>Contact</Typography>
                      <Typography sx={{ minWidth: 100 }}>Profile</Typography> */}
                      <Tooltip title="Account settings">
                        <IconButton
                          onClick={handleClick}
                          size="small"
                          sx={{ ml: 2 }}
                          aria-controls={open ? "account-menu" : undefined}
                          aria-haspopup="true"
                          aria-expanded={open ? "true" : undefined}
                        >
                          <Avatar sx={{ width: 32, height: 32 }}>
                            {JSON.parse(
                              localStorage.getItem("user-provider")
                            ).email[0].toUpperCase()}
                          </Avatar>
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Menu
                      anchorEl={anchorEl}
                      id="account-menu"
                      open={open}
                      onClose={() => {}}
                      onClick={() => {}}
                      PaperProps={{
                        elevation: 0,
                        sx: {
                          overflow: "visible",
                          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                          mt: 1.5,
                          "& .MuiAvatar-root": {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                          },
                          "&::before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: "background.paper",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                          },
                        },
                      }}
                      transformOrigin={{ horizontal: "right", vertical: "top" }}
                      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                    >
                      <MenuItem onClick={handleClose}>
                        <PermIdentityOutlinedIcon />{" "}
                        {
                          JSON.parse(localStorage.getItem("user-provider"))
                            .first_name
                        }{" "}
                        {
                          JSON.parse(localStorage.getItem("user-provider"))
                            .last_name
                        }
                      </MenuItem>
                      <MenuItem onClick={handleClose}>
                        <EmailTwoToneIcon />{" "}
                        {
                          JSON.parse(localStorage.getItem("user-provider"))
                            .email
                        }
                      </MenuItem>


                      {JSON.parse(localStorage.getItem("user-provider")).pos ===
                      "admin" ? (
                        <>
                          <MenuItem onClick={(_)=>{ navigate("/admin_home")}}>
                            <AdminPanelSettingsOutlinedIcon />{" "}
                            Admin_Home
                          </MenuItem>
                        </>
                      ) : (
                        ""
                      )}
                      <Divider />


                      <MenuItem onClick={handleCloseLogout}>
                        <ListItemIcon>
                          <Logout fontSize="small" />
                        </ListItemIcon>
                        Logout
                      </MenuItem>
                    </Menu>
                  </React.Fragment>
                </>
              ) : (
                <React.Fragment>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    {/* <Typography sx={{ minWidth: 100 }}>Contact</Typography>
                  <Typography sx={{ minWidth: 100 }}>Profile</Typography> */}
                    <Tooltip title="Account settings">
                      <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={open ? "account-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                      >
                        <Avatar sx={{ width: 32, height: 32 }}></Avatar>
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        "& .MuiAvatar-root": {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        "&::before": {
                          content: '""',
                          display: "block",
                          position: "absolute",
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: "background.paper",
                          transform: "translateY(-50%) rotate(45deg)",
                          zIndex: 0,
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  >
                    {/* <MenuItem onClick={handleClose}>
                    <Avatar /> History
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <Settings /> Password
                  </MenuItem>
                  <Divider />
                   */}

                    {/* <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                      <PersonAdd fontSize="small" />
                    </ListItemIcon>
                    Add another account
                  </MenuItem> */}
                    {/* <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                      <Settings fontSize="small" />
                    </ListItemIcon>
                    Settings
                  </MenuItem> */}
                    <MenuItem onClick={handleCloseLogin}>
                      <ListItemIcon>
                        <Logout fontSize="small" />
                      </ListItemIcon>
                      Login
                    </MenuItem>
                  </Menu>
                </React.Fragment>
              )}
            </div>
          </div>

          {/* column  */}
          <div className="grid grid-cols-11 gap-1 p-4 text-center">
            <h1>จัดการห้อง</h1>
            <h1>ห้อง</h1>
            <h1>วันที่เช็คอิน</h1>
            <h1>วันที่เช็คเอาท์</h1>
            <h1>สถานะ</h1>
            <h1>สลิปโอนเงิน</h1>
            <h1>อีเมล</h1>
            <h1>เบอร์โทร</h1>
            <h1>ราคาทั้งหมด</h1>
            <h1>จำนวนแมว</h1>
            <h1>คำขอพิเศษ</h1>
          </div>

          {data.map((item, index) => (
            <div className="grid grid-cols-11 gap-1 p-4 text-center " key={item._id}>
              <div className="grid grid-cols-3 gap-1  text-center">
              <button onClick={(_)=>{changeStatus(item._id, "pass")}} className="w-10 h-10 bg-green-400"></button>
              <button onClick={(_)=>{changeStatus(item._id, "pending")}} className="w-10 h-10 bg-yellow-400"></button>
              <button onClick={(_)=>{changeStatus(item._id, "failed")}} className="w-10 h-10 bg-red-400"></button>
              </div>
              <h1>{item.room_name}</h1>
              <h1>{formatDate(dayjs(item.check_in_date))}</h1>
              <h1>{formatDate(dayjs(item.check_out_date))}</h1>
              <h1>{item.status}</h1>
              <h1>{item.pay_way}</h1>
              <h1>{item.email}</h1>
              <h1>{item.phone}</h1>
              <h1>{item.total_price}</h1>
              <h1>{item.total_cats}</h1>
              <h1 className="">{item.special_request}</h1>
            </div>
          ))}
        </>
      )}
    </>
  );
}
