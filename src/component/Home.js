import { Route, Routes, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";

import Appbar from "../Appbar";

export default function Dashboard() {
  // axios fetch data
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8700/v1/room").then((res) => {
      setData(res.data.body);
      setLoading(false);
      console.log(res.data.body);
    });
  }, []);

  const saveToLocalStorage = (index) => {
    localStorage.setItem("data", JSON.stringify(data[index]));

    const res = JSON.parse(localStorage.getItem("data"));
    // console.log(index);
    
  };


  return (
    <>
    <Appbar />
      <h1>Dashboard</h1>
      {data.map((item, index) => (
        <div key={index}>
          <h2>{item.room_name}</h2>
          <p> ประเภท : {item.type}</p>
          <p> ขนาด : {item.size} เมตร </p>
          <p> จำนวนแมว : {item.number_of_cats} สูงสุด</p>
          <p> ราคา : {item.price} บาท </p>
          <p> ห้องที่ว่าง {item.number_of_rooms} ห้อง </p>
          <p> จำนวนกล้อง : {item.cameras}</p>
          <p> คำอธิบาย : {item.description}</p>
          <p> เวลาเริ่มเช็คอิน : จาก: 08:00 ถึง เวลาเช็คเอาท์ : 17:00</p>
           

          {item.image.map((img, index) => (
            <img
              key={index}
              src={
                "https://szrepoqlfkcnlfdeicse.supabase.co/storage/v1/object/public/rooms/" +
                item.type +
                "/" +
                img
              }
              alt={item.type}
              width={200}
              height={200}
            />
          ))}
          <div>
            <Link to={`/detail/${item.type}`}>
              <button onClick={()=>{saveToLocalStorage(index)}}>จองที่พัก</button>{" "}
            </Link>
          </div>
        </div>
      ))}
    </>
  );
}
<></>;
