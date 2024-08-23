import { Route, Routes, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";

import Appbar from "../Appbar";
import "../App.css";
export default function Dashboard() {
  // axios fetch data
  const [data, setData] = useState([]);
  const [booking, setBooking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [numcat, setNumcat] = useState(1);
  const [numcamera, setNumcamera] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [room_overlap, setRoom_overlap] = useState([]);
  const [err_check, setErr_check] = useState(true);

  useEffect(() => {
    fetchData();
    production_check();
  }, []);

  let production_check = () =>{
    let __DEV__ = window.location.origin.includes("localhost") || window.location.origin.includes("127.0.0.1");

    if(__DEV__){
      console.log("is dev");
    }else{
      console.log("is not dev");
    }
  }

  useEffect(() => {
    let overlaping = booking.filter(({ check_in_date, check_out_date }) => {
      const checkIn = new Date(check_in_date);
      const checkOut = new Date(check_out_date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return (
        (data.room_name === booking.room_name &&
          start >= checkIn &&
          start <= checkOut &&
          end >= checkIn &&
          end <= checkOut) ||
        (start <= checkIn &&
          start <= checkOut &&
          end >= checkIn &&
          end <= checkOut) ||
        (start >= checkIn &&
          start <= checkOut &&
          end >= checkIn &&
          end >= checkOut) ||
        (start <= checkIn &&
          start <= checkOut &&
          end >= checkIn &&
          end >= checkOut)
      );
    });

    let room_overlap = overlaping.reduce((acc, item) => {
      let found = acc.find((room) => room.room_name === item.room_name);
      if (found) {
        found.len_room += 1;
      } else {
        acc.push({
          room_name: item.room_name,
          len_room: 1,
        });
      }
      return acc;
    }, []);

    setRoom_overlap(room_overlap);
    //  console.log(room_overlap);
  }, [booking, data, numcat, numcamera, startDate, endDate]);

  // useEffect(() => {
  //   let num_cat = parseInt(JSON.parse(localStorage.getItem("number_of_cats")));
  //   let num_camera = parseInt(JSON.parse(localStorage.getItem("number_of_cameras")));
  //   setNumcat(num_cat);
  //   setNumcamera(num_camera);

  // },[numcat, numcamera]);

  const fetchData = async () => {
    axios.get("http://localhost:8700/v1/room").then((res) => {
      setData(res.data.body.room);
      setBooking(res.data.body.booking);
      console.log(res.data.body.room);
      console.log(res.data.body.booking);
      setLoading(false);
    });
  };

  const saveToLocalStorage = (index) => {
    localStorage.setItem("data", JSON.stringify(data[index]));

    const res = JSON.parse(localStorage.getItem("data"));
    // console.log(index);
  };

  const handleTimeChange = (e) => {
    setNumcat(e.numcat);
    setNumcamera(e.numcamera);
    setStartDate(e.startDate);
    setEndDate(e.endDate);
    // console.log(e);
  };
  const checkroom = (room_name) => {
    for (let i = 0; i < room_overlap.length; i++) {
      if (room_overlap[i].room_name === room_name) {
        // console.log(room_overlap[i].len_room);
        return room_overlap[i].len_room;
      }
    }
  };

  return (
    <>
      <div className=""></div>
      <Appbar handleAppbar={(e) => handleTimeChange(e)} />

      {/* <h1>Dashboard</h1> */}

      {data.map((item, index) => (
        <div key={index}>
          <div className="content-out">
            <div className="content">
              <div className="conten-left">
                <img
                  className="w-60  bg-blue-100"
                  key={index}
                  src={
                    "https://szrepoqlfkcnlfdeicse.supabase.co/storage/v1/object/public/rooms/" +
                    item.type +
                    "/" +
                    item.image[0]
                  }
                  alt={item.type}
                  width={200}
                  height={200}
                />

                <div className="content-label">
                  {/* {numcamera > item.cameras * (Math.ceil((numcat) / item.number_of_cats)) ? <p> จำนวนกล้องไม่เพียงพอ </p> : numcamera > 0 ?  <p>สามารถใช้กล้องได้มากสุด {item.cameras} ตัว ต่อ 1 ห้อง</p> : ""} */}
                  {/* {numcat > item.number_of_cats * item.number_of_rooms ? <p> ต้องการ {Math.ceil((numcat) / item.number_of_cats)} ห้อง แต่เหลือเพียง {item.number_of_rooms} ห้องว่าง</p> : ""} */}
                  {/* <p> ประเภท : {item.type}</p> */}
                  <h2 className="text-xl">{item.room_name}</h2>
                  {/* <p>{">"} ขนาด : {item.optional_services} เมตร </p> */}
                  <p>
                    {">"} จำนวนกล้อง : {item.cameras}
                  </p>
                  <p>
                    {">"} จำนวนแมว : {item.number_of_cats} สูงสุด
                  </p>
                  {/* <p>{">"} ราคา : {item.price} บาท </p> */}
                  {/* <p> ห้องทั้งหมด {item.number_of_rooms} ห้อง </p> */}
                  <p>
                    {"> "}
                    {checkroom(item.room_name) >= 0
                      ? `ห้องที่สามารถจองได้ : ${
                          item.number_of_rooms - checkroom(item.room_name)
                        }`
                      : `ห้องที่สามารถจองได้ : ${item.number_of_rooms}`}{" "}
                  </p>
                  <p>
                    {">"} คำอธิบาย : {item.description}
                  </p>
                  {/* <p> เวลาเริ่มเช็คอิน : จาก: 08:00 ถึง เวลาเช็คเอาท์ : 17:00</p> */}
                </div>
                <div className="py-20 px-10 text-center ">
                  <p>{item.price} บาท /คืน</p>

                  {numcamera >
                    item.cameras * Math.ceil(numcat / item.number_of_cats) &&
                  (numcat >
                    item.number_of_cats *
                      (item.number_of_rooms - checkroom(item.room_name)) ||
                    numcat > item.number_of_cats * item.number_of_rooms) ? (
                    <button className="btn-primary">
                      {"จำนวนกล้องไม่เพียงพอและ " +
                        `ต้องการ ${Math.ceil(
                          numcat / item.number_of_cats
                        )} ห้อง แต่เหลือเพียง  ${
                          item.number_of_rooms - checkroom(item.room_name)
                            ? item.number_of_rooms - checkroom(item.room_name)
                            : item.number_of_rooms
                        } ห้องว่าง `}
                    </button>
                  ) : numcat >
                      item.number_of_cats *
                        (item.number_of_rooms - checkroom(item.room_name)) ||
                    numcat > item.number_of_cats * item.number_of_rooms ? (
                    <button className="btn-primary">{` ต้องการ ${Math.ceil(
                      numcat / item.number_of_cats
                    )} ห้อง แต่เหลือเพียง ${
                      item.number_of_rooms - checkroom(item.room_name)
                        ? item.number_of_rooms - checkroom(item.room_name)
                        : item.number_of_rooms
                    } ห้องว่าง `}</button>
                  ) : numcamera >
                    item.cameras * Math.ceil(numcat / item.number_of_cats) ? (
                    <button className="btn-primary">
                      จำนวนกล้องไม่เพียงพอ
                    </button>
                  ) : (
                    <Link to={`/detail/${item.type}`}>
                      <button
                        className="btn-primary"
                        onClick={() => {
                          saveToLocalStorage(index);
                        }}
                      >
                        จองที่พัก
                      </button>{" "}
                    </Link>
                  )}
                </div>
              </div>
              {/* <div className="py-20 px-10 ">
              {numcamera > item.cameras * Math.ceil(numcat / item.number_of_cats) &&
              (numcat > item.number_of_cats * (item.number_of_rooms -  checkroom(item.room_name)) ||
               numcat > item.number_of_cats * item.number_of_rooms) ? (
                <button className="btn-primary">
                  {"จำนวนกล้องไม่เพียงพอและ " +
                    `ต้องการ ${Math.ceil(
                      numcat / item.number_of_cats
                    )} ห้อง แต่เหลือเพียง  ${
                      item.number_of_rooms - checkroom(item.room_name)
                        ? item.number_of_rooms - checkroom(item.room_name)
                        : item.number_of_rooms
                    } ห้องว่าง `}
                </button>
              ) : numcat > item.number_of_cats * (item.number_of_rooms - checkroom(item.room_name) )||
                numcat > item.number_of_cats * item.number_of_rooms ? (
                <button className="btn-primary">{` ต้องการ ${Math.ceil(
                  numcat / item.number_of_cats
                )} ห้อง แต่เหลือเพียง ${
                  item.number_of_rooms - checkroom(item.room_name)
                    ? item.number_of_rooms - checkroom(item.room_name)
                    : item.number_of_rooms
                } ห้องว่าง `}</button>
              ) : numcamera >
                item.cameras * Math.ceil(numcat / item.number_of_cats) ? (
                <button className="btn-primary">จำนวนกล้องไม่เพียงพอ</button>
              ) : (
                <Link to={`/detail/${item.type}`}>
                  <button
                    className="btn-primary"
                    onClick={() => {
                      saveToLocalStorage(index);
                    }}
                  >
                    จองที่พัก
                  </button>{" "}
                </Link>
              )}
            </div> */}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
<></>;
