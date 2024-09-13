import React from "react";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import moment from "moment-timezone";
import { DatePicker, Space } from "antd";

import Logo from "../cococat-hotel.png";

export default function Ad_Edit() {
  const { id } = useParams();

  const [data, setData] = useState([]);
  const [pay, setPay] = useState("");

  function production_check() {
    const isDevelopment =
      window.location.origin.includes("localhost") ||
      window.location.origin.includes("127.0.0.1");

    return isDevelopment
      ? "http://localhost:8700"
      : "https://cococatbackend.vercel.app";
  }

  useEffect(() => {
    fecthdata();
  }, []);

  dayjs.extend(customParseFormat);

  const { RangePicker } = DatePicker;
  const timezone = "Asia/Bangkok";
  const dateFormat = "YYYY-MM-DD";

  const formatDate = (date) => {
    return date.format("DD MMM-YYYY");
  };

  let fecthdata = async () => {
    const response = await fetch(production_check() + `/v1/booking/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    let passedValue = await new Response(response.body).text();
    let valueToJson = JSON.parse(passedValue).body;

    console.log(valueToJson);

    if (response.status == 201) {
      setData(valueToJson);
    }
  };

  // ห้อง
  // วันที่เช็คอิน
  // วันที่เช็คเอาท์
  // สถานะ
  // สลิปโอนเงิน
  // อีเมล
  // เบอร์โทร
  // ราคาทั้งหมด
  // จำนวนแมว
  // จำนวนกล้อง
  // คำขอพิเศษ

  return (
    <>
      {id}

      {data.map((item) => (
        <>
          <div key={item._id}>
            <div className=" ">
              <div title={item.room_name} arrow>
                <span className="truncate ...">ชื่อห้อง: {item.room_name}</span>
              </div>
              <div title={formatDate(dayjs(item.check_in_date))} arrow>
                <span>
                  วันที่เช็คอิน: {formatDate(dayjs(item.check_in_date))}
                </span>
              </div>
              <div title={formatDate(dayjs(item.check_out_date))} arrow>
                <span>
                  วันที่เช็คเอาท์: {formatDate(dayjs(item.check_out_date))}
                </span>
              </div>
              <div title={item.status} arrow>
                <span>สถานะการชำเงิน: {item.status}</span>
              </div>
              <div>
                <span>วิธีการชำระเงินชำระเงิน: {item.pay_way}</span>
              </div>

              <div>
                {item.image !== "" ? (
                  <img src={item.image} alt="Logo" width={60} height={60} />
                ) : (
                  <img src={Logo} alt="Logo" width={100} height={100} />
                )}
              </div>

              <div title={item.total_price} arrow>
                <span>ราคาทั้งหมด: {item.total_price}</span>
              </div>
              <div title={item.special_request} arrow>
                <span className="truncate ...">
                  คำขอพิเศษ: {item.special_request}
                </span>
              </div>

              <div title={item.total_cats} arrow>
                <span>จำนวนแมว: {item.total_cats}</span>
              </div>
              <div title={item.total_cameras} arrow>
                <span>จำนวนกล้อง: {item.total_cameras}</span>
              </div>

              <div title={item.email} arrow>
                <span className="truncate ...">อีเมลผู้จอง: {item.email}</span>
              </div>
              <div title={item.user_name} arrow>
                <span className="truncate ...">
                  ชื่อผู้จอง: {item.user_name}
                </span>
              </div>
              <div title={item.phone} arrow>
                <span className="truncate ...">
                  เบอร์โทรผู้จอง: {item.phone}
                </span>
              </div>

              <div title={item.user_name_2} arrow>
                <span>ชื่อผู้รับ/ฝาก: {item.user_name_2}</span>
              </div>
              <div title={item.phone_2} arrow>
                <span className="truncate ...">
                  เบอร์โทรผู้รับ/ฝาก: {item.phone_2}
                </span>
              </div>
            </div>
          </div>
        </>
      ))}
    </>
  );
}
