/* eslint-disable jsx-a11y/alt-text */
import { Route, Routes, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Feet from "../../assets/image/feet.png";
import LoadingSpinner from "../../component/Loading";
import Appbar from "../../component/Calendar";
import { Modal } from "antd";
import api from "../../utils/api";
import Login from "../auth/Login";

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [booking, setBooking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [numcat, setNumcat] = useState(1);
  const [numcamera, setNumcamera] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [room_overlap, setRoom_overlap] = useState([]);
  const [loac2, SetLoad2] = useState(false);
  const [error, setError] = useState("");
  const [modal1Open, setModal1Open] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    api.getBooking().then((res) => {
      setBooking(res.data.body);
      console.log(res.data.body);
    }).catch((err) => {
      setError(err.message);
    }).finally(() => {
      setLoading(false);
    });
    api.getRoom().then((res) => {
      setData(res.data.body);
      console.log(res.data.body);
    }).catch((err) => {
      setError(err.message);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

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
      } else {
        acc.push({
          room_name: item.room_name,
          len_room: item.total_rooms,
        });
      }
      return acc;
    }, []);

    setRoom_overlap(room_overlap);
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

  const checkroom = (room_name) => {
    for (let i = 0; i < room_overlap.length; i++) {
      if (room_overlap[i].room_name === room_name) {
        return room_overlap[i].len_room;
      }
    }
  };

  let handle_login = (e) => {
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

    <div>
      <div className=" hidden md:block ">
        <    div data-aos="fade-up">
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
              <p className="text-xm ">ยินดีต้อนรับเข้าสู่โรงแรมโคโค่แคท</p>
            </div>
            <hr />
            <Login handleAppbar={(e) => handle_login(e)} />
          </div>
        </Modal>

        {data.map((item, index) => (
          <div key={index} className="mx-auto">
            <div
              className={`${index % 2 === 0 ? "bg-[#B6D4F0]" : "bg-[#f2f4f6]"
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
                        key={index}
                        src={`${item.image[0]}`}
                        alt={item.room_name}
                      />
                    </div>

                    <div className="w-full">
                      <p className="opacity-45 font-extralight">CoCoCat Hotel</p>
                      <h2 className="text-3xl font-bold">{item.room_name}</h2>
                      <div className="mt-5 space-y-5">
                        <div className="flex space-x-4">
                          <img src={Feet} className="w-5 h-5" alt="feet" />
                          <p className="text-xm ">
                            สามารถใช้กล้องได้ทั้งหมด {item.cameras} ตัว
                          </p>
                        </div>
                        <div className="flex space-x-4">
                          <img src={Feet} className="w-5 h-5" alt="feet" />
                          <p className="text-xm ">
                            <p>จำนวนน้องแมว {item.number_of_cats} ตัว </p>
                          </p>
                        </div>

                        <div className="flex space-x-4">
                          <img src={Feet} className="w-5 h-5" alt="feet" />
                          <p className="text-xm ">
                            มีห้องว่างทั้งหมด{" "}
                            {checkroom(item.room_name) >= 0
                              ? `${item.number_of_rooms -
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
                          <img src={Feet} className="w-5 h-5" alt="feet" />
                          <p className="text-xm break-words">
                            {item.description}</p>
                        </div>

                        <div className="w-52 h-14 text-xl text-black bg-[#e8f773] hover:bg-[#f4f0af] flex rounded-full items-center text-center justify-center">
                          <p className="font-semibold">{item.price} บาท /คืน</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bottom-0 justify-end items-end flex h-96">
                    <span></span>
                    <div>
                      {numcamera >
                        item.cameras * Math.ceil(numcat / item.number_of_cats) &&
                        (numcat >
                          item.number_of_cats *
                          (item.number_of_rooms - checkroom(item.room_name)) ||
                          numcat > item.number_of_cats * item.number_of_rooms) ? (
                        <button className="btn-primary3">
                          {"จำนวนกล้องไม่เพียงพอและ " +
                            `ต้องการ ${Math.ceil(
                              numcat / item.number_of_cats
                            )} ห้อง เหลือเพียง ${item.number_of_rooms - checkroom(item.room_name)
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
                        (item.number_of_rooms - checkroom(item.room_name)) ||
                        numcat > item.number_of_cats * item.number_of_rooms ? (
                        <button className="btn-primary3">{` ต้องการ ${Math.ceil(
                          numcat / item.number_of_cats
                        )} ห้อง แต่เหลือเพียง ${item.number_of_rooms - checkroom(item.room_name)
                          ? item.number_of_rooms - checkroom(item.room_name) >=
                            0
                            ? item.number_of_rooms - checkroom(item.room_name)
                            : 0
                          : item.number_of_rooms
                          } ห้องว่าง `}</button>
                      ) : numcamera >
                        item.cameras * Math.ceil(numcat / item.number_of_cats) ? (
                        <button className="btn-primary3">
                          จำนวนกล้องไม่เพียงพอ
                        </button>
                      ) : (
                        <>
                          {localStorage.getItem("token") ? (
                            <>
                              <Link to={`/detail/${item.type}`}>
                                <button
                                  className="bg-[#16305C] hover:bg-[#224683] text-white w-40 mt-4 py-2 px-4 rounded-lg"
                                  onClick={() => {
                                    saveToLocalStorage(index);
                                  }}
                                >
                                  จองที่พัก
                                </button>
                              </Link>
                            </>
                          ) : (
                            <>
                              <button
                                className="bg-[#16305C] hover:bg-[#224683] text-white w-40 mt-4 py-2 px-4 rounded-lg"
                                onClick={() => {
                                  setModal1Open(true);
                                }}
                              >
                                จองที่พัก
                              </button>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

      </div>



      {/* Mobile Version */}
      <div className="block md:hidden container mx-auto px-4">
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
            <Login handleAppbar={(e) => handle_login(e)} />
          </div>
        </Modal>

        {data.map((item, index) => (
          <div key={index} className="mx-auto my-8 p-4 bg-[#B6D4F0] rounded-lg shadow-md">
            <div className="rounded-lg overflow-hidden">
              <img
                className="rounded-lg scale-95 object-cover border-gray-400 border-4 w-full"
                src={`${item.image[0]}`}
                alt={item.room_name}
              />
            </div>
            <div className="text-center mt-4">
              <p className="opacity-60 text-sm font-light">CoCoCat Hotel</p>
              <h2 className="text-2xl font-bold mt-1">{item.room_name}</h2>
            </div>
            <div className="mt-4 space-y-3 text-left text-gray-700">
              <div className="flex items-center space-x-2">
                <img src={Feet} className="w-5 h-5" alt="feet" />
                <p className="text-sm">สามารถใช้กล้องได้ทั้งหมด {item.cameras} ตัว</p>
              </div>
              <div className="flex items-center space-x-2">
                <img src={Feet} className="w-5 h-5" alt="feet" />
                <p className="text-sm">จำนวนน้องแมว {item.number_of_cats} ตัว</p>
              </div>
              <div className="flex items-center space-x-2">
                <img src={Feet} className="w-5 h-5" alt="feet" />
                <p className="text-sm">
                  มีห้องว่างทั้งหมด{" "}
                  {checkroom(item.room_name) >= 0
                    ? Math.max(item.number_of_rooms - checkroom(item.room_name), 0)
                    : item.number_of_rooms}{" "}
                  ห้อง
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <img src={Feet} className="w-5 h-5" alt="feet" />
                <p className="text-sm break-words">{item.description}</p>
              </div>
            </div>
            <div className="mt-6 w-full bg-[#e8f773] hover:bg-[#f4f0af] text-black rounded-full text-center py-3 text-lg font-semibold">
              {item.price} บาท /คืน
            </div>
            <div className="mt-4 flex justify-center">
              {numcamera > item.cameras * Math.ceil(numcat / item.number_of_cats) &&
                (numcat >
                  item.number_of_cats *
                  (item.number_of_rooms - checkroom(item.room_name)) ||
                  numcat > item.number_of_cats * item.number_of_rooms) ? (
                <button className="btn-primary3">
                  {"จำนวนกล้องไม่เพียงพอและ " +
                    `ต้องการ ${Math.ceil(
                      numcat / item.number_of_cats
                    )} ห้อง เหลือเพียง ${item.number_of_rooms - checkroom(item.room_name)
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
                (item.number_of_rooms - checkroom(item.room_name)) ||
                numcat > item.number_of_cats * item.number_of_rooms ? (
                <button className="btn-primary3">{` ต้องการ ${Math.ceil(
                  numcat / item.number_of_cats
                )} ห้อง แต่เหลือเพียง ${item.number_of_rooms - checkroom(item.room_name)
                  ? item.number_of_rooms - checkroom(item.room_name) >=
                    0
                    ? item.number_of_rooms - checkroom(item.room_name)
                    : 0
                  : item.number_of_rooms
                  } ห้องว่าง `}</button>
              ) : numcamera > item.cameras * Math.ceil(numcat / item.number_of_cats) ? (
                <button className="btn-primary3">จำนวนกล้องไม่เพียงพอ</button>
              ) : (
                <>
                  {localStorage.getItem("token") ? (
                    <Link to={`/detail/${item.type}`}>
                      <button
                        className="bg-[#16305C] hover:bg-[#224683] text-white w-40 py-2 rounded-lg"
                        onClick={() => saveToLocalStorage(index)}
                      >
                        จองที่พัก
                      </button>
                    </Link>
                  ) : (
                    <button
                      className="bg-[#16305C] hover:bg-[#224683] text-white w-40 py-2 rounded-lg"
                      onClick={() => setModal1Open(true)}
                    >
                      จองที่พัก
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}