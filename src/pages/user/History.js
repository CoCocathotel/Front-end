import * as React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../component/Loading";
import Tooltip from "@mui/material/Tooltip";
import { Tag } from "antd";
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import dayjs from "dayjs";
import api from "../../utils/api";

export default function BookingHistory() {
  const [loading, setLoading] = useState(true);
  const [boxid, setBoxID] = useState(0);
  const [status, setStatus] = useState("");
  const [data, setData] = useState([]);

  // ดึง email ของผู้ใช้จาก localStorage
  const getUserEmailFromLocalStorage = () => {
    const savedUser = localStorage.getItem("user-provider");
    const value = savedUser ? JSON.parse(savedUser) : null;
    return value?.email || null;
  };

  // ดึงข้อมูลการจองสำหรับผู้ใช้
  const fetchUserBookingEvent = async () => {
    const userEmail = getUserEmailFromLocalStorage();
    if (!userEmail) {
      console.error("User email not found. Please log in.");
      return;
    }

    try {
      const response = await api.getUserBookingEvent(userEmail);
      setData(response.data.body || []);
    } catch (error) {
      console.error("Failed to load booking events", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserBookingEvent();
  }, []);

  const data_information = status !== "" ? data.filter((item) => item.status === status) : data;

  const formatDate = (date) => {
    return dayjs(date).format("ddd, DD MMM-YYYY");
  };

  return (
    <>
      {loading ? (
        <div className="bg-gray-200 min-h-screen w-full">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="bg-gray-200 min-h-screen w-full">
          <div className="flex flex-col items-center p-4 md:p-8 lg:p-12">
            <div className="flex flex-row justify-around bg-white items-center w-full sm:w-3/4 lg:w-1/2 h-16 sm:h-20 mt-5 px-2 sm:px-4 py-3 sm:py-5 z-0 rounded-lg shadow-lg">
              <button onClick={() => { setBoxID(0); setStatus(""); }} className={`h-full w-full ${boxid === 0 ? "text-blue-500 border-b-2 border-blue-400" : ""}`}>
                ทั้งหมด
              </button>
              <button onClick={() => { setBoxID(1); setStatus("pending"); }} className={`h-full w-full truncate ${boxid === 1 ? "text-blue-500 border-b-2 border-blue-400" : ""}`}>
                กำลังตรวจสอบ
              </button>
              <button onClick={() => { setBoxID(2); setStatus("pass"); }} className={`h-full w-full ${boxid === 2 ? "text-blue-500 border-b-2 border-blue-400" : ""}`}>
                สำเร็จ
              </button>
              <button onClick={() => { setBoxID(3); setStatus("failed"); }} className={`h-full w-full ${boxid === 3 ? "text-blue-500 border-b-2 border-blue-400" : ""}`}>
                ยกเลิก
              </button>
            </div>
            {data_information.map((item) => (
              <div className="flex flex-col items-center justify-around px-2 sm:px-4 py-4 w-full" key={item._id}>
                <div className="bg-white p-4 sm:p-5 justify-between rounded-lg shadow-lg flex w-full sm:w-3/4 lg:w-1/2 h-auto">
                  <div className="text-sm flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-8 items-center sm:items-start">
                    <img src={item.imageRoom} className="rounded-xl shadow-lg w-24 h-32 object-cover" alt={item.type} />
                    <div className="overflow-hidden">
                      <Tooltip title={item.room_name} arrow>
                        <h1 className="text-lg">{item.room_name}</h1>
                      </Tooltip>
                      <Tooltip title={`รายละเอียดเพิ่มเติม: ${item.special_request}`} arrow>
                        <span className="text-xs text-gray-400 block">
                          รายละเอียดเพิ่มเติม: {item.special_request.slice(0, 20)}...
                        </span>
                      </Tooltip>
                      <Tooltip title={`ราคา: ${item.total_price} บาท`} arrow>
                        <h1>ราคา: {item.total_price} บาท</h1>
                      </Tooltip>
                      <Tooltip title={`แมว: ${item.total_cats}`} arrow>
                        <h1>แมว: {item.total_cats}</h1>
                      </Tooltip>
                      <Tooltip title={`รูปแบบการชำระ: ${item.pay_way}`} arrow>
                        <h1>รูปแบบการชำระ: {item.pay_way}</h1>
                      </Tooltip>
                      <div className="flex space-x-1">
                        <h1>สถานะการชำเงิน: </h1>
                        {item.status === "pending" ? (
                          <Tooltip title={item.status} arrow>
                            <Tag icon={<ClockCircleOutlined />} color="warning">Waiting</Tag>
                          </Tooltip>
                        ) : item.status === "pass" ? (
                          <Tooltip title={item.status} arrow>
                            <Tag icon={<CheckCircleOutlined />} color="success">Success</Tag>
                          </Tooltip>
                        ) : (
                          <Tooltip title={item.status} arrow>
                            <Tag icon={<CloseCircleOutlined />} color="error">Cancelled</Tag>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex flex-col space-y-2 items-end h-full">
                    <Tooltip title={`วันที่เช็คอิน: ${formatDate(item.check_in_date)} - วันที่เช็คเอาท์: ${formatDate(item.check_out_date)}`} arrow>
                      <div className="flex text-xs text-gray-400">
                        <h1>{formatDate(item.check_in_date)}</h1>
                        <h1> - </h1>
                        <h1>{formatDate(item.check_out_date)}</h1>
                      </div>
                    </Tooltip>
                    <Tooltip title={item.status} arrow>
                      <Link to={`/history/${item._id}`}>
                        <button className="hover:bg-[#A2A7A7] bg-[#55605B] text-white p-2 rounded-lg shadow-lg">
                          <h1 className="text-sm">ดูรายละเอียด</h1>
                        </button>
                      </Link>
                    </Tooltip>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
