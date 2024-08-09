// สร้างหน้า รายละเอียด
import React from "react";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import moment from "moment-timezone";

dayjs.extend(customParseFormat);

const dateFormat = "YYYY-MM-DD";
const timezone = "Asia/Bangkok";

export default function Detail() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { Type } = useParams();

  const [startDate, setStartDate] = useState(
    localStorage.getItem("startDate") || moment.tz(timezone).format()
  );
  const [endDate, setEndDate] = useState(
    localStorage.getItem("endDate") ||
      moment.tz(timezone).add(1, "day").format()
  );
  const [nunmcat, setNumcat] = useState(
    parseInt(JSON.parse(localStorage.getItem("number_of_cats")) || 1)
  );
  const [totalday, setTotalday] = useState(
    Math.abs(new Date(endDate) - new Date(startDate)) / 86400000
  );

  useEffect(() => {
    // let res = JSON.parse(localStorage.getItem("data"));
    let start = localStorage.getItem("startDate");
    let end = localStorage.getItem("endDate");
    let numcat = parseInt(JSON.parse(localStorage.getItem("number_of_cats")));
    let totalday = Math.abs(new Date(end) - new Date(start)) / 86400000;

    let getdata =  getRoom();
  
    
      if(start && end && numcat && getdata){
        // setData(getdata);
        setStartDate(start);
        setEndDate(end);
        setNumcat(numcat);
        setTotalday(totalday);
        }
     
  }, []);

 
  const getRoom = async () => {
    try {
      const response = await axios.get(`http://localhost:8700/v1/room/${Type}`);
      setLoading(false);
      setError(null);
      setData(response.data.body[0]);
      console.log(response.data.body[0]);
      return response.data.body[0];
    } catch (error) {
      setError(error);
    }
  };

  const SendApi = async () => {
    try {
     let item = {
        room_name: data.room_name,
        email: "vs@mail.com",
        check_in_date: new Date(startDate).toISOString(),
        check_out_date: new Date(endDate).toISOString(),
        total_price: data.price * totalday,
        total_cats: nunmcat,
        pay_way: "walk-in",
        status : "pending",
        total_cameras: data.cameras,
        image: "",
    }

    console.log(item);

    const response = await fetch(`http://localhost:8700/v1/book_room   `, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
    });

    const result = await response.json();
    console.log(result);

   
    } catch (error) {
      console.log(error);
    }
  };

  
  return (
    <div>
    
      <h2>เช็คอิน {startDate} จาก 08.00 </h2>
      <h2>เช็คอิน {endDate} จาก 17.00 </h2>
      <h2>จำนวนวันทั้งหมด {totalday} </h2>
      <h2>จำนวนแมว {nunmcat} </h2>
      <h2>{data.room_name}</h2>
      <p> ประเภท : {data.type}</p>
      <p> ขนาด : {data.size} เมตร </p>
      <p> จำนวนแมว : {data.number_of_cats} สูงสุด</p>
      <p> ราคา : {data.price} บาท </p>
      <p> ห้องที่ว่าง {data.number_of_rooms} ห้อง </p>
      <p> จำนวนกล้อง : {data.cameras}</p>
      <p> คำอธิบาย : {data.description}</p>
      <p> เวลาเริ่มเช็คอิน : จาก: 08:00 ถึง เวลาเช็คเอาท์ : 17:00</p>
    
      {data.image && data.image.length > 0 ? (
        <>
          {data.image.map((img, index) => (
            <img
              key={index}
              src={
                "https://szrepoqlfkcnlfdeicse.supabase.co/storage/v1/object/public/rooms/" +
                data.type +
                "/" +
                img
              }
              alt={data.type}
              width={200}
              height={200}
            />
          ))}
        </>
      ) : (
        <>
          <div className="placeholder">No Images</div>
        </>
      )}
      <div>
        <button onClick={SendApi}>จองที่พัก</button>{" "}
      </div>
    </div>
  );
}
