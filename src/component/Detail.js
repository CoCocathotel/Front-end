// สร้างหน้า รายละเอียด
import React from "react";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Logo from "../cococat-hotel.png";

import LoadingSpinner from "./Loading";
import Error from "./Error";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import moment from "moment-timezone";

dayjs.extend(customParseFormat);

const dateFormat = "YYYY-MM-DD";
const timezone = "Asia/Bangkok";

export default function Detail() {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);
  const { Type } = useParams();
  const [total, setTotal] = useState(0);
  const [payWay, setPayWay] = useState("walk-in");
  const [upload, setUpload] = useState(false);
  const [upload_slip, setUpload_slip] = useState(null);
  const [base64img, setBase64IMG] = useState(null);

  const [open_edit, setOpen_edit] = useState(false);

  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [phone, setPhone] = useState(null);
  const [special_request, setSpecialRequest] = useState(
    "ขอกระบะทราย มีน่ำ มีข้าวพร้อม"
  );

  const [selectedPayment, setSelectedPayment] = useState("");
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelectPayment = (method) => {
    setSelectedPayment(method);
  };

  function production_check() {
    const isDevelopment =
      window.location.origin.includes("localhost") ||
      window.location.origin.includes("127.0.0.1");

    return isDevelopment
      ? "http://localhost:8700"
      : "https://co-cocat-backend-theta.vercel.app";
  }

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

  const [numcamera, setNumcamera] = useState(
    parseInt(JSON.parse(localStorage.getItem("number_of_cameras")) || 0)
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
    let numcamera = parseInt(
      JSON.parse(localStorage.getItem("number_of_cameras"))
    );

    let get_user = JSON.parse(localStorage.getItem("user-provider"));
    console.log(get_user);

    setUsername(get_user.first_name + " " + get_user.last_name);
    setEmail(get_user.email);
    setPhone(get_user.phone);

    console.log(error);

    let getdata = getRoom();

    let num;

    if (Type === "fan-room") {
      num = numcat;
    } else if (Type === "ac-standard-room") {
      num = Math.ceil(numcat / 2);
    } else if (Type === "ac-connecting-room") {
      num = Math.ceil(numcat / 4);
    }

    // console.log(Type, num, numcat);

    if (start && end && numcat && getdata) {
      // setData(getdata);
      setStartDate(start);
      setEndDate(end);
      setNumcat(numcat);
      setTotalday(totalday);
      setNumcamera(numcamera);
      setTotal(num);
    }
  }, []);

  const getRoom = async () => {
    try {
      const response = await axios.get(production_check() + `/v1/room/${Type}`);
      // set time intervale
      setTimeout(() => {
        setLoading(false);
      }, 2000);

      setError(null);
      setData(response.data.body[0]);
      // console.log(response.data.body[0]);
      return response.data.body[0];
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    // console.log("base64: ", base64img);
  }, [upload_slip, base64img]);

  let convertToBase64 = () => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(upload_slip);

      reader.onload = () => {
        setBase64IMG(reader.result);
        resolve(reader.result);
      };

      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleBuy = async () => {
    try {
      if (upload_slip instanceof Blob) {
        const reader = new FileReader();
        reader.readAsDataURL(upload_slip);
        reader.onloadend = function () {
          const img = reader.result;
          proceedWithPurchase(img);
        };
        reader.onerror = function (err) {
          console.error("Error reading image file:", err);
          proceedWithPurchase("");
        };
      } else {
        proceedWithPurchase("");
      }
    } catch (err) {
      console.log("An error occurred. Please try again.");
    }
  };

  let proceedWithPurchase = async (img) => {
    try {
      let item = {
        room_name: data.room_name,
        type: data.type,
        user_name: username,
        email: email,
        phone: phone,
        special_request: special_request,
        check_in_date: new Date(startDate).toISOString(),
        check_out_date: new Date(endDate).toISOString(),
        total_price: data.price * totalday,
        total_cats: nunmcat,
        total_rooms: total,
        pay_way: selectedPayment,
        status: "pending",
        total_cameras: data.cameras,
        image: selectedPayment === "credit" ? img : "",
      };

      console.log(item);

      const response = await fetch(production_check() + `/v1/book_room`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      });

      setLoading(true);

      const result = await response.json();

      console.log(result, "result");

      if (result) {
        setTimeout(() => {
          setLoading(false);
          navigate("/");
        }, 2000);
      }
    } catch (err) {
      console.log("An error occurred. Please try again.");
    }
  };

  // const SendApi = async () => {
  //   try {
  //     if (selectedPayment === "credit" && !upload) {
  //       alert("กรุณาอัพโหลดสลิปโอนเงิน");
  //       return;
  //     } else if (selectedPayment === "credit" && upload) {
  //       // console.log(base64img);
  //     } else if (selectedPayment === "walk-in") {
  //       console.log("walk-in");
  //     }
  //     let item = {
  //       room_name: data.room_name,
  //       type: data.type,
  //       user_name: username,
  //       email: email,
  //       phone: phone,
  //       special_request: special_request,
  //       check_in_date: new Date(startDate).toISOString(),
  //       check_out_date: new Date(endDate).toISOString(),
  //       total_price: data.price * totalday,
  //       total_cats: nunmcat,
  //       total_rooms: total,
  //       pay_way: selectedPayment,
  //       status: "pending",
  //       total_cameras: data.cameras,
  //       image: selectedPayment === "credit" ? base64img : "",
  //     };

  //     console.log(item);

  // const response = await fetch(`http://localhost:8700/v1/book_room`, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify(item),
  // });

  // const result = await response.json();

  // console.log(result , "result");
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const handleFileChange = (e) => {
  //   setUpload_slip(e.target.files[0]);
  // };

  return (
    <div>
      {loading ? (
        <>
          <LoadingSpinner />
        </>
      ) : (
        <>
          {error ? (
            <>
              {" "}
              <Error />{" "}
            </>
          ) : (
            <>
              <div className="">
                <div className="sticky top-0 bg-white z-50">
                  <div className="sticky top-0 bg-white z-50 shadow-md">
                    <div className="grid grid-cols-5 items-center gap-1 p-4">
                      <img
                        className="ml-24"
                        src={Logo}
                        alt="logo"
                        width={80}
                        height={80}
                      />

                      <div className="col-span-3 flex justify-center space-x-8">
                        <div className="flex items-center">
                          <div className="flex items-center justify-center w-8 h-8 text-white bg-green-500 rounded-full">
                            1
                          </div>
                          <span className="ml-2 text-gray-500 font-semibold">
                            เลือกรายการ
                          </span>
                        </div>

                        <div className="flex-grow h-px bg-gray-300"></div>
                        <div className="flex items-center">
                          <div className="flex items-center justify-center w-8 h-8 text-white bg-orange-300 rounded-full">
                            2
                          </div>
                          <span className="ml-2 text-gray-500 font-semibold">
                            ชำระเงิน
                          </span>
                        </div>

                        <div className="flex-grow h-px bg-gray-300"></div>
                        <div className="flex items-center">
                          <div className="flex items-center justify-center w-8 h-8 text-white bg-gray-300 rounded-full">
                            3
                          </div>
                          <span className="ml-2 text-gray-500 font-semibold">
                            เสร็จสิ้น
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-black text-2xl font-semibold py-2 px-4 shadow-md align-middle justify-center flex space-x-20 h-24 items-center">
                  <h1>รายละเอียดห้องพัก</h1>
                </div>

                <div className="flex justify-center bg-gray-100">
                  <div className="py-10 justify-center text-2xl bg-white ml-10 mr-10 mt-10 mb-10 rounded-sm shadow-md focus:outline-none focus:ring-opacity-750">
                    <div className="text-center flex mb-10 ml-5">
                      กรอกข้อมูล
                    </div>
                    <hr />
                    {/* <div className="text-center flex mb-10 ml-5 mt-5">
                      ข้อมูลการจอง
                    </div> */}
                    <div className="flex items-center  border-gray-400 mr-5 ml-5 mt-10 mb-10">
                      <div className="ml-20 mt-4 mr-10 py-4 px-5">
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
                                width={100}
                                height={100}
                              />
                            ))}
                          </>
                        ) : (
                          <>
                            <div className="placeholder">No Images</div>
                          </>
                        )}
                      </div>
                      <div className="">
                        <h2 className="mb-10 text-2xl font-semibold text-black">
                          ห้อง {data.room_name}
                        </h2>
                        <p className="mr-7 text-sm font-light text-black">
                          {" "}
                          ห้องพัก {data.room_name} เริ่มเช็คอิน : จาก: 08:00 ถึง
                          เวลาเช็คเอาท์ : 17:00 โดย {data.description}
                        </p>
                      </div>
                    </div>

                    <hr />
                    <div className="text-center flex mt-10  ml-5 justify-between mr-10">
                      {" "}
                      ข้อมูลการติดต่อ{" "}
                      {/* {!open_edit && (
                        <div
                          className="text-sm font-semibold text-right text-blue-400 underline"
                          onClick={() =>
                            open_edit ? setOpen_edit(false) : setOpen_edit(true)
                          }
                        >
                          {" "}
                          แก้ไขข้อมูล
                        </div>
                      )}
                      {open_edit && (
                        <div className=" text-sm">
                          <button
                            className="btn-primary"
                            onClick={() => setOpen_edit(false)}
                          >
                            บันทึก
                          </button>
                        </div>
                      )} */}
                    </div>
                    {/* 
                    <div className="px-4 py-5 text-sm text-gray-500 flex justify-start items-end mr-5 ml-5 mt-10 mb-10">
                      {open_edit && (
                        <>
                          <div className="nice_grid">
                            <p>ชื่อ</p>
                            <input
                              type="text"
                              className="px-4 py-1 bg-gray-200"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                            />
                            <p>เบอร์โทร</p>
                            <input
                              type="text"
                              className="px-4 py-1 bg-gray-200"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                            />
                            <p>อีเมล</p>
                            <input
                              type="text"
                              className="px-4 py-1 bg-gray-200"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                            <p>คำขอพิเศษ</p>
                            <input
                              type="text"
                              className="px-4 py-1 bg-gray-200"
                              value={special_request}
                              onChange={(e) =>
                                setSpecialRequest(e.target.value)
                              }
                            />
                          </div>
                        </>
                      )}

                      {!open_edit && (
                        <div className="nice_grid">
                          <p>ชื่อ</p>
                          <p className="px-4 py-1 "> {username}</p>

                          <p>เบอร์โทร</p>
                          <p className="px-4 py-1 ">{phone}</p>

                          <p>อีเมล</p>
                          <p className="px-4 py-1 ">{email}</p>

                          <p>คำขอพิเศษ</p>
                          <p className="px-4 py-1 ">{special_request}</p>
                        </div>
                      )}
                    </div> */}

                    <div className="space-y-4 p-6 rounded-lg text-sm mt-3">
                      <div className="grid grid-cols-1 gap-4">
                        <input
                          type="text"
                          placeholder="First Name"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="border border-gray-300 rounded p-2"
                        />
                        <input
                          type="email"
                          placeholder="E-mail address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="border border-gray-300 rounded p-2"
                        />
                        <input
                          type="text"
                          placeholder="Mobile number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="border border-gray-300 rounded p-2"
                        />
                      </div>
                      <div className="mt-4">
                        <h4 className="text-lg font-medium mb-2">
                          Special Request (optional)
                        </h4>
                        <textarea
                          className="w-full border border-gray-300 rounded p-2"
                          rows="4"
                          value={special_request}
                          onChange={(e) => setSpecialRequest(e.target.value)}
                          placeholder="Enter any special requests..."
                        ></textarea>
                      </div>
                    </div>
                    <div className="text-center flex mt-10 mb-10 ml-5">
                      <h1>เลือกวิธีการชำระเงิน</h1>
                      <p>{""}</p>
                    </div>

                    <div className="px-4 py-5 text-sm   text-gray-500  items-center mr-5 ml-5 mt-10 mb-10 focus:outline-none focus:ring-opacity-750">
                      <div className="flex justify-evenly px-4 py-5">
                        <button
                          className={`${
                            selectedPayment === "walk-in"
                              ? "bg-blue-500   text-white w-1/2 py-5"
                              : "bg-gray-300   text-black w-1/2 py-5"
                          }`}
                          onClick={() => handleSelectPayment("walk-in")}
                        >
                          ชำระเงินปลายทาง
                        </button>
                        <button
                          className={`${
                            selectedPayment === "credit"
                              ? "bg-blue-500   text-white w-1/2  py-5"
                              : "bg-gray-300  text-black  w-1/2  py-5"
                          }`}
                          onClick={() => handleSelectPayment("credit")}
                        >
                          ชำระเงินผ่านบัตรเครดิต
                        </button>
                      </div>

                      {selectedPayment === "credit" && (
                        <>
                          {upload && (
                            <React.Fragment>
                              <div
                                className="flex justify-center items-center text-center h-96"
                                onClick={() => {}}
                              >
                                <Button
                                  className=""
                                  variant="outlined"
                                  onClick={handleClickOpen}
                                >
                                  <img
                                    src={URL.createObjectURL(upload_slip)}
                                    alt="Uploaded"
                                    width={200}
                                    height={200}
                                  />
                                </Button>
                                <Dialog
                                  open={open}
                                  onClose={handleClose}
                                  PaperProps={{
                                    component: "form",
                                    onSubmit: async (event) => {
                                      event.preventDefault();
                                      const formData = new FormData(
                                        event.currentTarget
                                      );
                                      const file = formData.get("paymentSlip");

                                      if (file) {
                                        setUpload_slip(file);
                                        setUpload(true);
                                      }
                                      handleClose();
                                    },
                                  }}
                                >
                                  <DialogTitle>อัพโหลดสลิปโอนเงิน</DialogTitle>
                                  <DialogContent>
                                    <DialogContentText>
                                      กรุณาอัพโหลดสลิปโอนเงินเพื่อยืนยันการชำระเงินของคุณ
                                      ได้ที่ QR code... .
                                      <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1280px-QR_code_for_mobile_English_Wikipedia.svg.png"
                                        alt="QR code"
                                        width={250}
                                        height={250}
                                      />
                                    </DialogContentText>
                                    <input
                                      autoFocus
                                      required
                                      margin="dense"
                                      id="paymentSlip"
                                      name="paymentSlip"
                                      type="file"
                                      accept="image/*"
                                      style={{
                                        display: "block",
                                        marginTop: "20px",
                                      }}
                                    />
                                  </DialogContent>
                                  <DialogActions>
                                    <Button onClick={handleClose}>
                                      {" "}
                                      ยกเลิก{" "}
                                    </Button>
                                    <Button type="submit">อัพโหลด</Button>
                                  </DialogActions>
                                </Dialog>
                              </div>
                            </React.Fragment>
                          )}

                          {!upload && (
                            <div className="justify-center items-center text-center flex h-96">
                              <React.Fragment>
                                <Button
                                  className=""
                                  variant="outlined"
                                  onClick={handleClickOpen}
                                >
                                  อัพโหลดสลิปโอนเงิน
                                </Button>
                                <Dialog
                                  open={open}
                                  onClose={handleClose}
                                  PaperProps={{
                                    component: "form",
                                    onSubmit: async (event) => {
                                      event.preventDefault();
                                      const formData = new FormData(
                                        event.currentTarget
                                      );
                                      const file = formData.get("paymentSlip");

                                      if (file) {
                                        setUpload_slip(file);
                                        setUpload(true);
                                      }
                                      handleClose();
                                    },
                                  }}
                                >
                                  <DialogTitle>อัพโหลดสลิปโอนเงิน</DialogTitle>
                                  <DialogContent>
                                    <DialogContentText>
                                      กรุณาอัพโหลดสลิปโอนเงินเพื่อยืนยันการชำระเงินของคุณ
                                      ได้ที่ QR code... .
                                      <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1280px-QR_code_for_mobile_English_Wikipedia.svg.png"
                                        alt="QR code"
                                        width={250}
                                        height={250}
                                      />
                                    </DialogContentText>
                                    <input
                                      autoFocus
                                      required
                                      margin="dense"
                                      id="paymentSlip"
                                      name="paymentSlip"
                                      type="file"
                                      accept="image/*"
                                      style={{
                                        display: "block",
                                        marginTop: "20px",
                                      }}
                                    />
                                  </DialogContent>
                                  <DialogActions>
                                    <Button onClick={handleClose}>
                                      ยกเลิก
                                    </Button>
                                    <Button type="submit">อัพโหลด</Button>
                                  </DialogActions>
                                </Dialog>
                              </React.Fragment>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  <div className=" bg-white mr-10 ml-0 mt-10 w-fu mb-4 px-5 py-6 h-max w-96 rounded-3xl shadow-md focus:outline-none items-center justify-center text-center focus:ring-opacity-75">
                    <h1 className="mb-5 text-2xl items-center justify-center text-center">
                      แสดงรายละเอียด
                    </h1>

                    <div className="grid grid-cols-2 gap-1 space-y-2 justify-between">
                      <p className="text-left">วันที่เช็คอิน</p>
                      <p className="text-right">
                        {dayjs(startDate).format("DD/MM/YYYY")}
                      </p>

                      <p className="text-left">วันที่เช็คเอาท์</p>
                      <p className="text-right">
                        {dayjs(endDate).format("DD/MM/YYYY")}
                      </p>

                      <p className="text-left">จำนวนวันที่เข้าพัก</p>
                      <p className="text-right">{totalday}</p>

                      <p className="text-left">จำนวนห้อง</p>
                      <p className="text-right">{total} ห้อง</p>

                      <p className="text-left">จำนวนแมว</p>
                      <p className="text-right">{nunmcat}</p>

                      <p className="text-left">จำนวนกล้อง</p>
                      <p className="text-right">{numcamera} อัน</p>

                      <p className="text-left">ราคาห้องพัก</p>
                      <p className="text-right">{data.price} บาท</p>

                      <p className="text-left">ราคาที่ต้องจ่าย</p>
                      <p className="text-right">{data.price * totalday} บาท</p>
                    </div>
                    <button
                      className="mt-4 hover:bg-blue-500 bg-blue-400 w-40 h-12 rounded-lg text-white shadow-lg items-center justify-center text-center"
                      onClick={handleBuy}
                    >
                      ยืนยันการจอง
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
          <footer className=" bg-[#8CAFCB] p-14  items-center justify-between text-center shadow-lg w-full">
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
          </footer>
        </>
      )}
    </div>
  );
}
