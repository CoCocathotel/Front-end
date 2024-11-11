/* eslint-disable jsx-a11y/alt-text */
import { Route, Routes, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
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
  const [camera_overlap, setCamera_overlap] = useState([]); // New state for camera overlap
  const [loac2, SetLoad2] = useState(false);
  const [error, setError] = useState("");
  const [modal1Open, setModal1Open] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    api.getBooking().then((res) => {
      setBooking(res.data.body);
    }).catch((err) => {
      setError(err.message);
    }).finally(() => {
      setLoading(false);
    });
    api.getRoom().then((res) => {
      setData(res.data.body);
    }).catch((err) => {
      setError(err.message);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const overlapingRooms = booking.filter(({ check_in_date, check_out_date }) => {
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

    const room_overlap = overlapingRooms.reduce((acc, item) => {
      const found = acc.find((room) => room.room_name === item.room_name);
      if (found) {
        found.len_room += item.total_rooms;
      } else {
        acc.push({
          room_name: item.room_name,
          len_room: item.total_rooms,
        });
      }
      return acc;
    }, []);

    // Similar logic for checking camera availability
    const camera_overlap = overlapingRooms.reduce((acc, item) => {
      const found = acc.find((camera) => camera.room_name === item.room_name);
      if (found) {
        found.len_camera += item.cameras;
      } else {
        acc.push({
          room_name: item.room_name,
          len_camera: item.cameras,
        });
      }
      return acc;
    }, []);

    setRoom_overlap(room_overlap);
    setCamera_overlap(camera_overlap);
  }, [booking, data, numcat, numcamera, startDate, endDate]);

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
    const room = room_overlap.find((r) => r.room_name === room_name);
    return room ? room.len_room : 0;
  };

  const checkCameraAvailability = (room_name) => {
    const camera = camera_overlap.find((c) => c.room_name === room_name);
    return camera ? camera.len_camera : 0;
  };

  let handleLogin = (e) => {
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

  return (
    <div className="w-full">
      <div className="w-full flex justify-center" data-aos="fade-up">
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
            <p className="text-sm">ยินดีต้อนรับเข้าสู่โรงแรมโคโค่แคท</p>
          </div>
          <hr />
          <Login handleAppbar={(e) => handleLogin(e)} />
        </div>
      </Modal>

      {data.map((item, index) => {
  const requiredRooms = Math.ceil(numcat / item.number_of_cats);
  const availableRooms = Math.max(item.number_of_rooms - checkRoomAvailability(item.room_name), 0);
  const requiredCameras = numcamera;
  const availableCameras = Math.max(item.cameras - checkCameraAvailability(item.room_name), 0);
  
  const isRoomAvailable = requiredRooms <= availableRooms;
  const isCameraAvailable = requiredCameras <= availableCameras;

  return (
    <div key={index} className="w-full">
      <div
        className={`${index % 2 === 0 ? "bg-[#B6D4F0]" : "bg-[#f2f4f6]"} 
                    flex flex-col lg:flex-row p-7 items-center justify-center lg:align-middle w-full`}
      >
        <div
          className="rounded-lg px-4 py-5 w-full lg:w-10/12"
          data-aos="fade-up"
        >
          <div className="flex flex-col lg:flex-row">
            <div className="col-span-2 flex flex-col lg:flex-row space-y-5 lg:space-y-0 lg:space-x-5 overflow-hidden w-full">
              <div className="w-full lg:w-96">
                <img
                  className="rounded-lg scale-95 object-cover border-gray-400 border-4 w-full"
                  src={`${item.image[0]}`}
                  alt={item.room_name}
                />
              </div>

              <div className="w-full">
                <p className="opacity-45 font-extralight text-sm lg:text-base">CoCoCat Hotel</p>
                <h2 className="text-2xl lg:text-3xl font-bold">{item.room_name}</h2>
                <div className="mt-5 space-y-3 lg:space-y-5">
                  <div className="flex space-x-4">
                    <img src={Feet} className="w-4 lg:w-5 h-4 lg:h-5" alt="feet" />
                    <p className="text-sm lg:text-base">สามารถใช้กล้องได้ทั้งหมด {item.cameras} ตัว</p>
                  </div>
                  <div className="flex space-x-4">
                    <img src={Feet} className="w-4 lg:w-5 h-4 lg:h-5" alt="feet" />
                    <p className="text-sm lg:text-base">จำนวนน้องแมว {item.number_of_cats} ตัว</p>
                  </div>
                  <div className="flex space-x-4">
                    <img src={Feet} className="w-4 lg:w-5 h-4 lg:h-5" alt="feet" />
                    <p className="text-sm lg:text-base">
                      มีห้องว่างทั้งหมด {availableRooms} ห้อง และกล้องว่าง {availableCameras} ตัว
                    </p>
                  </div>
                  <div className="flex space-x-4">
                    <img src={Feet} className="w-4 lg:w-5 h-4 lg:h-5" alt="feet" />
                    <p className="text-sm lg:text-base break-words">{item.description}</p>
                  </div>
                  <div className="w-full lg:w-52 h-12 lg:h-14 text-lg lg:text-xl text-black bg-[#e8f773] hover:bg-[#f4f0af] flex rounded-full items-center text-center justify-center">
                    <p className="font-semibold">{item.price} บาท /คืน</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bottom-0 justify-end items-end flex h-full lg:h-96 mt-4 lg:mt-0">
              <div className="w-full lg:w-52 h-12 lg:h-14 flex items-center text-center rounded-full mt-4">
                {isRoomAvailable && isCameraAvailable ? (
                  localStorage.getItem("token") ? (
                    <Link to={`/detail/${item.type}`} className="w-full h-full">
                      <button
                        className="w-full h-full font-semibold text-lg lg:text-xl bg-[#16305C] text-white hover:bg-[#224683] rounded-full flex items-center justify-center"
                        onClick={() => saveToLocalStorage(index)}
                      >
                        จองที่พัก
                      </button>
                    </Link>
                  ) : (
                    <button
                      className="w-full h-full font-semibold text-lg lg:text-xl bg-[#16305C] text-white hover:bg-[#224683] rounded-full flex items-center justify-center"
                      onClick={() => setModal1Open(true)}
                    >
                      จองที่พัก
                    </button>
                  )
                ) : !isRoomAvailable ? (
                  <button
                    className="w-full h-full font-semibold text-lg lg:text-xl bg-gray-400 text-gray-200 cursor-not-allowed rounded-full flex items-center justify-center"
                    disabled
                  >
                    จำนวนห้องไม่เพียงพอ
                  </button>
                ) : !isCameraAvailable ? (
                  <button
                    className="w-full h-full font-semibold text-lg lg:text-xl bg-gray-400 text-gray-200 cursor-not-allowed rounded-full flex items-center justify-center"
                    disabled
                  >
                    จำนวนกล้องไม่เพียงพอ
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
})}
    </div>
  );
}
