import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Feet from "../../assets/image/feet.png";
import LoadingSpinner from "../../component/Loading";
import Appbar from "../../component/Calendar";
import { Modal } from "antd";
import api from "../../utils/api";
import Login from "../auth/Login";

export default function BookingDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [booking, setBooking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [numcat, setNumcat] = useState(1);
  const [numcamera, setNumcamera] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [room_overlap, setRoom_overlap] = useState([]);
  const [modal1Open, setModal1Open] = useState(false);
  const [loac2, setLoac2] = useState(false);

  const isLoggedIn = () => {
    return !!localStorage.getItem("token"); // คืนค่า true หาก token มีอยู่ใน localStorage
  };

  const saveToLocalStorage = (index) => {
    localStorage.setItem("data", JSON.stringify(data[index]));
    JSON.parse(localStorage.getItem("data"));
  };

  const handleTimeChange = (e) => {
    setNumcat(e.numcat);
    setNumcamera(e.numcamera);
    setStartDate(e.startDate);
    setEndDate(e.endDate);
  };

  const checkRoomAvailability = (room_name) => {
    const overlap = room_overlap.find((room) => room.room_name === room_name);
    return overlap ? overlap.len_room : 0;
  };

  const handleLogin = (e) => {
    setModal1Open(e);
    if (e) {
      SetLoad2(e);
      setTimeout(() => {
        SetLoad2(!e);
      }, 1000);
    } else {
      SetLoad2(e);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }
  return (

    <div>
      {/* Appbar และ Modal */}
      <div data-aos="fade-up">
        <Appbar handleAppbar={(e) => handleTimeChange(e)} />
      </div>
      <Modal
        style={{ top: 20 }}
        open={modal1Open}
        onCancel={() => setModal1Open(false)}
        footer={null}
        loading={loac2}
      >
        <div className="space-y-4">
          <h1 className="text-3xl">เข้าสู่ระบบ</h1>
          <div className="flex space-x-4">
            <img src={Feet} className="w-5 h-5" alt="feet" />
            <p className="text-xm">ยินดีต้อนรับเข้าสู่โรงแรมโคโค่แคท</p>
          </div>
          <hr />
          <Login handleAppbar={(e) => handleLogin(e)} />
        </div>
      </Modal>

      {/* Mapping Data */}
      {data.map((item, index) => {
        const availableRooms =
          item.number_of_rooms - checkRoomAvailability(item.room_name) >= 0
            ? item.number_of_rooms - checkRoomAvailability(item.room_name)
            : 0;

        const requiredRooms = Math.ceil(numcat / item.number_of_cats);
        const isRoomSufficient = availableRooms >= requiredRooms;
        const isCameraSufficient =
          numcamera <= item.cameras * Math.ceil(numcat / item.number_of_cats);

        return (
          <div key={index}>
            {/* Desktop Version */}
            <div className="hidden md:block mx-auto">
              <div
                className={`${
                  index % 2 === 0 ? "bg-[#B6D4F0]" : "bg-[#f2f4f6]"
                } flex p-7 justify-center items-center align-middle w-screen h-full`}
              >
                <div
                  className="rounded-lg px-4 py-5 w-full h-auto ml-72 mr-72"
                  data-aos="fade-up"
                >
                  <div className="flex">
                    <div className="col-span-2 flex space-x-5 overflow-hidden">
                      <div className="w-96">
                        <img
                          className="rounded-lg scale-95 object-cover border-gray-400 border-4"
                          src={`${item.image[0]}`}
                          alt={item.room_name}
                        />
                      </div>
                      <div className="w-full">
                        <p className="opacity-45 font-extralight">
                          CoCoCat Hotel
                        </p>
                        <h2 className="text-3xl font-bold">{item.room_name}</h2>
                        <div className="mt-5 space-y-5">
                          <div className="flex space-x-4">
                            <img src={Feet} className="w-5 h-5" alt="feet" />
                            <p className="text-xm">
                              สามารถใช้กล้องได้ทั้งหมด {item.cameras} ตัว
                            </p>
                          </div>
                          <div className="flex space-x-4">
                            <img src={Feet} className="w-5 h-5" alt="feet" />
                            <p className="text-xm">
                              จำนวนน้องแมว {item.number_of_cats} ตัว
                            </p>
                          </div>
                          <div className="flex space-x-4">
                            <img src={Feet} className="w-5 h-5" alt="feet" />
                            <p className="text-xm">
                              มีห้องว่างทั้งหมด {availableRooms} ห้อง
                            </p>
                          </div>
                          <div className="flex space-x-4">
                            <img src={Feet} className="w-5 h-5" alt="feet" />
                            <p className="text-xm break-words">
                              {item.description}
                            </p>
                          </div>
                          <div className="w-52 h-14 text-xl text-black bg-[#e8f773] hover:bg-[#f4f0af] flex rounded-full items-center justify-center">
                            <p className="font-semibold">
                              {item.price} บาท /คืน
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bottom-0 justify-end items-end flex h-96">
                      <div>
                        {!isRoomSufficient && !isCameraSufficient ? (
                          <button className="btn-primary3">
                            จำนวนกล้องและห้องไม่เพียงพอ
                          </button>
                        ) : !isRoomSufficient ? (
                          <button className="btn-primary3">
                            ต้องการ {requiredRooms} ห้อง แต่เหลือเพียง{" "}
                            {availableRooms} ห้อง
                          </button>
                        ) : !isCameraSufficient ? (
                          <button className="btn-primary3">
                            จำนวนกล้องไม่เพียงพอ
                          </button>
                        ) : (
                          <button
                          className="bg-[#16305C] hover:bg-[#224683] text-white w-40 mt-4 py-2 px-4 rounded-lg"
                          onClick={() => {
                            if (isLoggedIn()) {
                              // หาก login แล้ว ให้ไปที่หน้าจอง
                              saveToLocalStorage(index);
                              navigate(`/detail/${item.type}`);
                            } else {
                              // หากยังไม่ได้ login ให้เปิด Modal
                              setModal1Open(true);
                            }
                          }}
                        >
                          จองที่พัก
                        </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Version */}
            <div className="block md:hidden p-4">
              <div
                className={`${
                  index % 2 === 0 ? "bg-[#B6D4F0]" : "bg-[#f2f4f6]"
                } rounded-lg p-4`}
              >
                <div className="flex flex-col items-center">
                  <img
                    className="rounded-lg object-cover w-full max-h-72 border-gray-400 border-4"
                    src={`${item.image[0]}`}
                    alt={item.room_name}
                  />
                  <p className="opacity-45 font-extralight text-center mt-2">
                    CoCoCat Hotel
                  </p>
                  <h2 className="text-lg font-bold text-center">
                    {item.room_name}
                  </h2>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center space-x-2">
                      <img src={Feet} className="w-4 h-4" alt="feet" />
                      <p className="text-sm">
                        สามารถใช้กล้องได้ทั้งหมด {item.cameras} ตัว
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <img src={Feet} className="w-4 h-4" alt="feet" />
                      <p className="text-sm">
                        จำนวนน้องแมว {item.number_of_cats} ตัว
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <img src={Feet} className="w-4 h-4" alt="feet" />
                      <p className="text-sm">
                        มีห้องว่างทั้งหมด {availableRooms} ห้อง
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <img src={Feet} className="w-4 h-4" alt="feet" />
                      <p className="text-sm">{item.description}</p>
                    </div>
                    <div className="w-full h-14 text-xl text-black bg-[#e8f773] hover:bg-[#f4f0af] flex rounded-full items-center justify-center">
                      <p className="font-semibold">{item.price} บาท /คืน</p>
                    </div>
                    <div className="mt-4 text-center">
                      {!isRoomSufficient && !isCameraSufficient ? (
                        <button className="btn-primary3 w-full">
                          จำนวนกล้องและห้องไม่เพียงพอ
                        </button>
                      ) : !isRoomSufficient ? (
                        <button className="btn-primary3 w-full">
                          ต้องการ {requiredRooms} ห้อง แต่เหลือเพียง{" "}
                          {availableRooms} ห้อง
                        </button>
                      ) : !isCameraSufficient ? (
                        <button className="btn-primary3 w-full">
                          จำนวนกล้องไม่เพียงพอ
                        </button>
                      ) : (
                        <button
                        className="bg-[#16305C] hover:bg-[#224683] text-white w-40 mt-4 py-2 px-4 rounded-lg"
                        onClick={() => {
                          if (isLoggedIn()) {
                            // หาก login แล้ว ให้ไปที่หน้าจอง
                            saveToLocalStorage(index);
                            navigate(`/detail/${item.type}`);
                          } else {
                            // หากยังไม่ได้ login ให้เปิด Modal
                            setModal1Open(true);
                          }
                        }}
                      >
                        จองที่พัก
                      </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}