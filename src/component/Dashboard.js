import { Route, Routes, Link, json } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Logo from "../cococat-hotel.png";
import Cat01 from "../assets/image/cat01.png";
import Feet from "../assets/image/feet.png";
import CatIcon from "../assets/image/cat_icon.png";

import LoadingSpinner from "./Loading";
import Appbar from "../Appbar";
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
import Tooltip from "@mui/material/Tooltip";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import SendIcon from "@mui/icons-material/Send";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";

import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import EmailTwoToneIcon from "@mui/icons-material/EmailTwoTone";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";

// icons-material/PersonAdd
// icons-material/Settings
// mui/icons-material/Logout

import { bottomNavigationActionClasses } from "@mui/material";

export default function Dashboard() {
  const navigate = useNavigate();
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
  const [url, setURL] = useState("");

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
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

  const handleCloseLogin = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user-provider");
    // window.location.reload();
    navigate("/login");
    setAnchorEl(null);
  };

  useEffect(() => {
    fetchData();
    // setLoading(false);
  }, []);

  function production_check() {
    const isDevelopment =
      window.location.origin.includes("localhost") ||
      window.location.origin.includes("127.0.0.1");

    return isDevelopment
      ? "http://localhost:8700"
      : "https://cococatbackend.vercel.app";
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
        found.len_room += item.total_rooms;
        // console.log(item.total_rooms);
      } else {
        acc.push({
          room_name: item.room_name,
          len_room: item.total_rooms,
        });
      }
      return acc;
    }, []);

    setRoom_overlap(room_overlap);
    // console.log(room_overlap);
    //  console.log(room_overlap);
  }, [booking, data, numcat, numcamera, startDate, endDate]);

  // useEffect(() => {
  //   let num_cat = parseInt(JSON.parse(localStorage.getItem("number_of_cats")));
  //   let num_camera = parseInt(JSON.parse(localStorage.getItem("number_of_cameras")));
  //   setNumcat(num_cat);
  //   setNumcamera(num_camera);

  // },[numcat, numcamera]);

  const fetchData = async () => {
    // let link = "http://localhost:8700/v1/room";

    // console.log(production_check());

    axios.get(production_check() + "/v1/room").then((res) => {
      setData(res.data.body.room);
      setBooking(res.data.body.booking);
      setLoading(false);
      // setTimeout(() => {
      //   setLoading(false);
      // }, 2000);
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
    // console.log("ok ok ok");

    // show circle loading 2 sec
    // fetchData();
    // production_check();
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
    <div>
      {loading ? (
        <>
          <LoadingSpinner />
        </>
      ) : (
        <>
          {/* <div className="sticky top-0 bg-white z-50">
            <Appbar_master />
          </div> */}
          {/* <hr /> */}
          <Appbar handleAppbar={(e) => handleTimeChange(e)} />

          {/* <h1>Dashboard</h1> */}

          {data.map((item, index) => (
            <div key={index} className="">
              <div className={`${index%2==0 ? "bg-[#BCD1D2]": "bg-[#EAEDF1]"} flex py-7 px-4 justify-center items-center align-middle w-full h-full space-x-20`}>
                <div className="  rounded-lg px-4 py-5 w-full h-auto  ml-72 mr-72">
                  <div className="flex">
                    <div className="col-span-2 flex space-x-5 overflow-hidden">
                      <div className="w-96">
                        <img
                          className="rounded-lg h-96 w-full object-cover border-x-orange-500 border-y-orange-900 border-4"
                          key={index}
                          src={
                            "https://hiykwrlgoinmxgqczucv.supabase.co/storage/v1/object/public/rooms/" +
                            item.type +
                            "/" +
                            item.image[0]
                          }
                        />
                      </div>
                      {/* <div className="absolute h-96 w-96 items-end justify-end flex">
                        <img src={Cat01} alt="cat01" className="w-52 " />
                      </div> */}

                      <div className="w-full">
                        <p className="opacity-45 font-extralight">
                          CoCoCat Hotel
                        </p>
                        <h2 className="text-3xl text-bold">{item.room_name}</h2>
                        <div className="mt-5 space-y-5">
                          <div className="flex space-x-4">
                            <img src={Feet} className="w-5  h-5" alt="feet" />
                            <p className="text-xm ">
                              สามารถใช้กล้องได้ทั้งหมด {item.cameras} ตัว
                            </p>
                          </div>

                          <div className="flex space-x-4">
                            <img src={Feet} className="w-5  h-5" alt="feet" />

                            <p className="text-xm ">
                              มีห้องว่างทั้งหมด{" "}
                              {checkroom(item.room_name) >= 0
                                ? `${
                                    item.number_of_rooms -
                                      checkroom(item.room_name) >=
                                    0
                                      ? item.number_of_rooms -
                                        checkroom(item.room_name)
                                      : 0
                                  }`
                                : `${item.number_of_rooms}`}{" "}
                              ห้อง
                            </p>
                          </div>

                          <div className="flex space-x-4">
                            <img src={Feet} className="w-5  h-5" alt="feet" />

                            <p className="text-xm ">{item.description}</p>
                          </div>

                          <div className="w-52 h-14 text-xl text-[#15181C] bg-[#e7ec9d] flex rounded-full items-center text-center justify-center">
                            <p className="font-semibold">
                              {item.price} บาท /คืน
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="py-10  px-5 overflow-hidden w-64 h-96 text-center grid grid-cols-1 gap-40 ">
                      
                      <div className="">
                        <p>จำนวนน้องแมว {item.number_of_cats } ตัว </p> 
                        <div className="flex items-center justify-center ">
                          {Array.from(
                            { length: item.number_of_cats },
                            (_, i) => (
                              <img src={CatIcon} key={i} className="w-10 h-10 mt-5"/>
                            )
                          )}
                        </div>
                      </div>
                      <div>
                        {numcamera >
                          item.cameras *
                            Math.ceil(numcat / item.number_of_cats) &&
                        (numcat >
                          item.number_of_cats *
                            (item.number_of_rooms -
                              checkroom(item.room_name)) ||
                          numcat >
                            item.number_of_cats * item.number_of_rooms) ? (
                          <button className="btn-primary3">
                            {"จำนวนกล้องไม่เพียงพอและ " +
                              `ต้องการ ${Math.ceil(
                                numcat / item.number_of_cats
                              )} ห้อง เหลือเพียง  ${
                                item.number_of_rooms - checkroom(item.room_name)
                                  ? item.number_of_rooms -
                                      checkroom(item.room_name) >=
                                    0
                                    ? item.number_of_rooms -
                                      checkroom(item.room_name)
                                    : 0
                                  : item.number_of_rooms
                              } ห้องว่าง `}
                          </button>
                        ) : numcat >
                            item.number_of_cats *
                              (item.number_of_rooms -
                                checkroom(item.room_name)) ||
                          numcat >
                            item.number_of_cats * item.number_of_rooms ? (
                          <button className="btn-primary3">{` ต้องการ ${Math.ceil(
                            numcat / item.number_of_cats
                          )} ห้อง แต่เหลือเพียง ${
                            item.number_of_rooms - checkroom(item.room_name)
                              ? item.number_of_rooms -
                                  checkroom(item.room_name) >=
                                0
                                ? item.number_of_rooms -
                                  checkroom(item.room_name)
                                : 0
                              : item.number_of_rooms
                          } ห้องว่าง `}</button>
                        ) : numcamera >
                          item.cameras *
                            Math.ceil(numcat / item.number_of_cats) ? (
                          <button className="btn-primary3">
                            จำนวนกล้องไม่เพียงพอ
                          </button>
                        ) : (
                          <Link to={`/detail/${item.type}`}>
                            <button
                              className="bg-[#55605B] hover:bg-[#A2A7A7] text-white w-40 mt-4 py-2 px-4 rounded-lg"
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
                  </div>
                </div>
              </div>
            </div>
          ))}
          {/* <footer className=" bg-[#8CAFCB] p-14  items-center justify-between text-center shadow-lg w-full">
            <h1 className="text-3xl text-left text-white">ติดต่อเรา</h1>
            <div className="flex  text-white justify-between   mt-2 mb-10">
              <div className=" text-left">
                <div>
                  <p>Adress</p>
                  <p>
                    121, 105 3 Ban Tungree, Kho Hong, Hat Yai District, Songkhla
                    90110
                  </p>
                </div>
              </div>
              <div className=" text-white text-left  items-end justify-end">
                <p>โทร : 065-384-5659</p>
                <p>Line : https://lin.ee/8OFTOx2l(@cococathotel)IG</p>
                <p>Tiktok : cococat.hotelTiktok: cococat.hotel</p>
              </div>
            </div>
            <hr />
            <h1 className="text-left text-white p-5">
              © 2023 All rights Reserved.
            </h1>
          </footer> */}
        </>
      )}
    </div>
  );
}
