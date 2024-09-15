import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Logo from "../cococat-hotel.png";
import Img_bg from "../cococat_preview.jpg";
import LoadingSpinner from "../component/Loading";

import DragIndicatorOutlinedIcon from "@mui/icons-material/DragIndicatorOutlined";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
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

import AddOutlinedIcon from "@mui/icons-material/Delete";

import DeleteIcon from "@mui/icons-material/Delete";

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

  function production_check() {
    const isDevelopment =
      window.location.origin.includes("localhost") ||
      window.location.origin.includes("127.0.0.1");

    return isDevelopment
      ? "http://localhost:8700"
      : "https://cococatbackend.vercel.app";
  }



  let proceedWithDelete = async (id) => {
    try {
      let item = {
        _id: id,
        
      };
  
      const response = await fetch(production_check() + `/v1/delete_book_room`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      });
  
      const result = await response.json();
  
      console.log(result, "result");
  
      if (response.status == 200) {
        fecthdata();
      }
    } catch (err) {
      console.log("An error occurred. Please try again.");
    }
  };

  const fecthdata = async () => {
    try {
      const response = await fetch(
        "https://cococatbackend.vercel.app/v1/cart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({
            email: JSON.parse(localStorage.getItem("user-provider")).email,
            pos: "admin",
          }),
        }
      );
      const result = await response.json();
      console.log(result, "admin");
      let x_data = result.body.reverse();
      setData(x_data);
      setLoading(false);
    } catch (err) {
      console.log("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    fecthdata();
    // setLoading(false);
  }, []);
  

  
  const changeStatus = async (id, status) => {
    try {
      const response = await fetch(
        "https://cococatbackend.vercel.app/v1/update-status",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({
            id: id,
            status: status,
          }),
        }
      );
      const result = await response.json();
      console.log(result);
      fecthdata();
    } catch (err) {
      console.log("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <div className="p-4">
          <div className="grid grid-cols-12 gap-1 text-center mb-4">
            {[
              "จัดการห้อง",
              "ห้อง",
              "วันที่เช็คอิน",
              "วันที่เช็คเอาท์",
              "สถานะการชำเงิน",
              "วิธีการชำระเงิน",
              "ราคาทั้งหมด",
              "คำขอพิเศษ",
              "ชื่อผู้จอง",
              "เบอร์โทร",
              "ชื่อผู้รับ/ฝาก",
              "เบอร์โทรผู้รับ/ฝาก",
            ].map((header) => (
              <h1 key={header} className="font-bold text-sm">
                {header}
              </h1>
            ))}
          </div>

          {loading ? (
            <>
              <LoadingSpinner />
            </>
          ) : (
            <>
              {data.map((item) => (
                <div
                  key={item._id}
                  className="grid grid-cols-12 gap-4 p-4 text-center text-sm mb-4 mt- border-b border-gray-300 "
                >
                  <div className="flex justify-center h-5 items-center space-x-1 ">
                    <button
                      className="col-span-1 hover:bg-gray-50 rounded-lg bg-yellow-300 h-10 w-10 "
                      onClick={(_) => {
                        navigate(`/admin_edit/${item._id}`);
                      }}
                    >
                      <ModeEditOutlinedIcon />
                    </button>
                    <button onClick={(_)=>{proceedWithDelete(item._id); setLoading(true);}} className="col-span-1 hover:bg-gray-50 rounded-lg bg-red-300 h-10 w-10 ">
                      <AddOutlinedIcon />
                    </button>
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
                                  setLoading(true);
                                }}
                              >
                                <Typography variant="inherit">pass</Typography>
                              </MenuItem>
                              <MenuItem
                                onClick={() => {
                                  changeStatus(item._id, "pending");
                                  popupState.close();
                                  setLoading(true);
                                }}
                              >
                                <Typography variant="inherit">
                                  pending
                                </Typography>
                              </MenuItem>
                              <MenuItem
                                onClick={() => {
                                  changeStatus(item._id, "failed");
                                  popupState.close();
                                  setLoading(true);
                                }}
                              >
                                <Typography variant="inherit">
                                  failed
                                </Typography>
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
                    <Tooltip
                      title={formatDate(dayjs(item.check_in_date))}
                      arrow
                    >
                      <span>{formatDate(dayjs(item.check_in_date))}</span>
                    </Tooltip>
                    <Tooltip
                      title={formatDate(dayjs(item.check_out_date))}
                      arrow
                    >
                      <span>{formatDate(dayjs(item.check_out_date))}</span>
                    </Tooltip>
                    <Tooltip title={item.status} arrow>
                      <span>{item.status}</span>
                    </Tooltip>
                    <Tooltip title={item.pay_way} arrow>
                      <span>{item.pay_way}</span>
                    </Tooltip>
                    <Tooltip title={item.total_price} arrow>
                      <span className="truncate ...">{item.total_price}</span>
                    </Tooltip>
                    <Tooltip title={item.special_request} arrow>
                      <span className="truncate ...">
                        {item.special_request}
                      </span>
                    </Tooltip>
                    <Tooltip title={item.user_name} arrow>
                      <span>{item.user_name}</span>
                    </Tooltip>
                    <Tooltip title={item.phone} arrow>
                      <span>{item.phone}</span>
                    </Tooltip>
                    <Tooltip title={item.user_name_2} arrow>
                      <span>{item.user_name_2}</span>
                    </Tooltip>
                    <Tooltip title={item.phone_2} arrow>
                      <span className="truncate ...">{item.phone_2}</span>
                    </Tooltip>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}
