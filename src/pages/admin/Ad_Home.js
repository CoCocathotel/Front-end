import * as React from "react";

import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import LoadingSpinner from "../../component/Loading";
import Detail from "../../component/Detail";
import axios from 'axios';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Stack from "@mui/material/Stack";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import Typography from "@mui/material/Typography";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";

import { Modal } from "antd";
import Draggable from "react-draggable";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
// import { newDate } from "react-datepicker/dist/date_utils";

export default function Ad_Home() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [today, setToday] = useState(dayjs());

  const [open, setOpen] = useState(false);

  dayjs.extend(customParseFormat);

  const handleOk = (e) => {
    console.log(e);
    setOpen(false);
  };

  const handleCancel = (e) => {
    console.log(e);
    setOpen(false);
  };

  const formatDate = (date) => {
    return date.format("DD MMM-YYYY");
  };

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
      const response = await axios.post(
        productionCheck() + "/v1/cart",
        {
          email: JSON.parse(localStorage.getItem("user-provider")).email,
          pos: "admin",
        },
        {
          headers: {
            "Content-Type": "application/json",
            // Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
  
      // สมมติว่าข้อมูลมีฟิลด์ `check_in_date` ที่เราจะใช้ในการจัดเรียง
      // let x_data = response.data.body.sort((a, b) => {
      //   const dateA = new Date(a.check_in_date); // เปลี่ยนเป็นฟิลด์วันที่ที่ถูกต้อง
      //   const dateB = new Date(b.check_in_date);
  
      //   return dateA - dateB; // จัดเรียงตามลำดับวันที่จากเก่าไปใหม่
      // });
  
      setData(response.data.body);
      setLoading(false);
    } catch (err) {
      console.log("An error occurred. Please try again.");
    }
  };
  
  const changeStatus = async (id, status) => {
    try {
      const response = await axios.post(
        productionCheck() + "/v1/update-status",
        {
          id: id,
          status: status,
        },
        {
          headers: {
            "Content-Type": "application/json",
            // Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      console.log(response.data);
      fecthdata();
    } catch (err) {
      console.log("An error occurred. Please try again.");
    }
  };
  

  const [statusList] = useState(["pending", "pass", "failed"]);

  useEffect(() => {
    fecthdata();
  }, []);

  return (
    <>
      <div className="overflow-x-auto">
        <div className="p-4">
          {loading ? (
            <>
              <LoadingSpinner />
            </>
          ) : (
            <>
              {/* <div className="p-4 rounded-lg shadow-md mb-20">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-xl font-bold text-gray-800">
                      รายการจอง
                    </h1>
                    <h2 className="text-lg text-gray-600">
                      วันนี้: {formatDate(today)}
                    </h2>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ArrowBackIcon className="cursor-pointer text-gray-500 hover:text-gray-700" />
                    <ArrowForwardIcon className="cursor-pointer text-gray-500 hover:text-gray-700" />
                  </div>
                </div>
              </div> */}

              <div className="grid grid-cols-12 gap-1 text-center mb-4">
                {[
                  "ลำดับ",
                  "ห้อง",
                  "",
                  "สถานะ",
                  "วิธีการชำระเงิน",
                  "เช็คอิน",
                  "เช็คเอาท์",
                  "ราคา",
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
              {data
                // .filter((value) => value.status !== "failed" && formatDate(today) === formatDate(dayjs(value.check_in_date)))
                .sort((a, b) => {
                  const statusOrder = { pending: 1, pass: 2, failed: 3 }; // Define the order
                  return statusOrder[a.status] - statusOrder[b.status]; // Sort according to the defined order
                })
                .map((item, index) => (
                  <div
                    key={item._id}
                    className="grid grid-cols-12 gap-4 p-2 h-14 text-center items-center text-sm  border-b border-gray-300 hover:bg-blue-50 "
                  >
                    <div className="col-span-12 grid grid-cols-12 gap-4 text-gray-700  text-center items-center">
                      <Tooltip>
                        <span>{index + 1}</span>
                      </Tooltip>
                      <Tooltip title={item.room_name} arrow>
                        <span className="truncate ...">{item.room_name}</span>
                      </Tooltip>

                      <Tooltip>
                        <span>
                          <div className="col-span-1 rounded-lg ">
                            <PopupState
                              variant="popover"
                              popupId="demo-popup-menu"
                            >
                              {(popupState) => (
                                <React.Fragment>
                                  <button>
                                    <MoreVertIcon
                                      {...bindTrigger(popupState)}
                                    />
                                  </button>
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
                                        // changeStatus(item._id, "pass");
                                        // setEditId(item._id);
                                        popupState.close();
                                        navigate("/admin_edit/" + item._id);
                                        // showModal();
                                        // setLoading(true);
                                      }}
                                    >
                                      <Typography variant="inherit">
                                        <div>Edit</div>
                                      </Typography>
                                    </MenuItem>
                                    {/* <MenuItem
                                    onClick={() => {
                                      // changeStatus(item._id, "pending");
                                      proceedWithDelete(item._id);
                                      popupState.close();
                                      setLoading(true);
                                    }}
                                  >
                                    <Typography variant="inherit">
                                      <div>Delete</div>
                                    </Typography>
                                  </MenuItem> */}
                                  </Menu>
                                </React.Fragment>
                              )}
                            </PopupState>
                          </div>
                        </span>
                      </Tooltip>

                      <div>
                        <select
                          value={item.status}
                          onChange={(e) => {
                            changeStatus(item._id, e.target.value);
                            setLoading(true);
                          }}
                          className={`${
                            item.status === "pending"
                              ? "bg-yellow-200"
                              : item.status === "failed"
                              ? "bg-red-200"
                              : "bg-green-200"
                          } p-2 rounded-lg transition-colors duration-200 ease-in-out focus:bg-white hover:bg-white`}>
                          {statusList.map((status) => (
                            <option key={status} value={status}>
                              {status === "pending"
                                ? "ตรวจสอบ"
                                : status === "pass"
                                ? "ยืนยัน"
                                : "ลบข้อมูล"}
                            </option>
                          ))}
                        </select>
                      </div>

                      <Tooltip title={item.pay_way} arrow>
                        <span>{item.pay_way}</span>
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

                      <Tooltip title={item.total_price} arrow>
                        <span className="truncate ...">{item.total_price}</span>
                      </Tooltip>

                      <Tooltip title={item.user_name} arrow>
                        <span className="truncate ...">{item.user_name}</span>
                      </Tooltip>
                      <Tooltip title={item.phone} arrow>
                        <span className="truncate ...">{item.phone}</span>
                      </Tooltip>
                      <Tooltip title={item.user_name_2} arrow>
                        <span className="truncate ...">{item.user_name_2}</span>
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
        <Modal
          open={open}
          onOk={handleOk}
          onCancel={handleCancel}
          width="90vw"
          height="900vh"
          centered={true}
        ></Modal>
      </div>
    </>
  );
}
