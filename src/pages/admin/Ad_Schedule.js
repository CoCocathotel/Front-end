import * as React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import LoadingSpinner from "../../component/Loading";
import Detail from "../../component/Detail";
import Card from "./Card";
import Tooltip from "@mui/material/Tooltip";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Modal } from "antd";
import api from "../../utils/api";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

export default function Ad_Schedule() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [today, setToday] = useState(dayjs());
  const [previousData, setPreviousData] = useState([]);

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



  const fecthdata = async () => {
    api.getAllEvent({ role: 'admin' })
      .then((res) => {
        setData(res.data.body);
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      })
  };

  const changeStatus = async (id, status) => {
    api.changeStatus(
      {
        id: id,
        status: status,
      },)
      .then((res) => {
       
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        fecthdata();
      })
  };
  const [statusList] = useState(["pending", "pass", "failed"]);

  useEffect(() => {
    fecthdata();
  }, []);

  // Function to go to the previous day
  const handlePrevDay = () => {
    setToday(today.subtract(1, "day"));
  };

  // Function to go to the next day
  const handleNextDay = () => {
    setToday(today.add(1, "day"));
  };

  const calculateChanges = (current, previous, status) => {
    const previousDay = today.subtract(1, "day");

    const currentCount = current.filter(
      (item) => item.status === status && formatDate(today) === formatDate(dayjs(item.check_in_date))
    ).length;

    const previousCount = previous.filter(
      (item) => item.status === status && formatDate(previousDay) === formatDate(dayjs(item.check_in_date))
    ).length;

    const change = previousCount;
    //   console.log(currentCount, previousCount)
    return { currentCount, change };
  };

  const pendingStats = calculateChanges(data, previousData, "pending");
  const passStats = calculateChanges(data, previousData, "pass");
  const failedStats = calculateChanges(data, previousData, "failed");

  useEffect(() => {
    fecthdata();
  }, [today]);

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
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-xl font-bold text-gray-800 mb-5">
                    รายการจอง
                  </h1>
                  <h2 className="text-lg text-gray-600 mb-5">
                    วันนี้: {formatDate(today)}
                  </h2>
                </div>
                <div className="flex items-center space-x-2">
                  {/* Previous Day Button */}
                  <ArrowBackIcon
                    onClick={handlePrevDay}
                    className="cursor-pointer text-gray-500 hover:text-gray-700"
                  />
                  {/* Next Day Button */}
                  <ArrowForwardIcon
                    onClick={handleNextDay}
                    className="cursor-pointer text-gray-500 hover:text-gray-700"
                  />
                </div>
              </div>
              <div className="grid grid-cols-12 gap-1 text-center ">
                {[
                  "ลำดับ","ห้อง","สถานะ","วิธีการชำระเงิน",
                  "เช็คอิน","เช็คเอาท์","ราคา","ชื่อผู้จอง",
                  "เบอร์โทร","ชื่อผู้รับ/ฝาก","เบอร์โทรผู้รับ/ฝาก",
                  // "ดูรายละเอียด",
                ].map((header) => (
                  <h1 key={header} className="font-bold text-sm">
                    {header}
                  </h1>
                ))}
              </div>
              {data
                .filter(
                  (value) =>
                    value.status !== "failed" &&
                    formatDate(today) === formatDate(dayjs(value.check_in_date))
                )
                .sort((a, b) => {
                  const statusOrder = { pending: 1, pass: 2, failed: 3 };
                  return statusOrder[a.status] - statusOrder[b.status];
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


                      <div>
                        <select
                          value={item.status}
                          onChange={(e) => {
                            changeStatus(item._id, e.target.value);
                            setLoading(true);
                          }}
                          className={`${item.status === "pending"
                              ? "bg-yellow-200"
                              : item.status === "failed"
                                ? "bg-red-200"
                                : "bg-green-200"
                            } p-2 rounded-lg transition-colors duration-200 ease-in-out focus:bg-white hover:bg-white`}
                        >
                          {statusList.map((status) => (
                            <option key={status} value={status}>
                              {status === "pending"
                                ? "ตรวจสอบ"
                                : status === "pass"
                                  ? "ยืนยัน"
                                  : "ยกเลิก"}
                            </option>
                          ))}
                        </select>
                      </div>
                      <Tooltip title={item.pay_way} arrow>
                        <span>{item.pay_way}</span>
                      </Tooltip>
                      <Tooltip
                        title={formatDate(dayjs(item.check_in_date))}
                        arrow>
                        <span>{formatDate(dayjs(item.check_in_date))}</span>
                      </Tooltip>
                      <Tooltip
                        title={formatDate(dayjs(item.check_out_date))}
                        arrow>
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
                      <Tooltip title="ดูรายละเอียด" arrow>
                        <span>
                          <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => { 
                              navigate("/admin_edit/" + item._id) 
                              window.location.reload();                  
                              }} >
                            ดูรายละเอียด
                          </button>
                        </span>
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
