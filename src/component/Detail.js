// สร้างหน้า รายละเอียด
import React from "react";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import PromtPay from "../assets/image/promt-pay.png";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import LoadingSpinner from "./Loading";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import PaymentsIcon from "@mui/icons-material/Payments";
import api from "../utils/api";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import moment from "moment-timezone";

import { Button, Modal } from "antd";

dayjs.extend(customParseFormat);

const dateFormat = "YYYY-MM-DD";
const timezone = "Asia/Bangkok";

export default function Detail() {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);
  const { type } = useParams();
  const { id } = useParams();
  const [total, setTotal] = useState(0);
  const [upload, setUpload] = useState(false);
  const [upload_slip, setUpload_slip] = useState(null);
  const [base64img, setBase64IMG] = useState(null);
  const [pos, setPosition] = useState("");
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [phone, setPhone] = useState(null);
  const [special_request, setSpecialRequest] = useState(
    "ขอกระบะทราย มีน่ำ มีข้าวพร้อม"
  );
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

  const [modal, contextHolder] = Modal.useModal();

  const [username2, setUsername2] = useState(null);
  const [phone2, setPhone2] = useState(null);

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
  const countDown = () => {
    let secondsToGo = 5;

    const instance = modal.success({
      title: "การจองสำเร็จ",
      content: `ระบบจะกลับไปยังหน้าแรกในอีก ${secondsToGo} วินาที`,
      onOk: () => {
        clearInterval(timer);
        navigate('/');
        window.location.reload();
      },
    });

    const timer = setInterval(() => {
      secondsToGo -= 1;
      instance.update({
        content: `ระบบจะกลับไปยังหน้าแรกในอีก ${secondsToGo} วินาที`,
      });
    }, 1000);

    setTimeout(() => {
      clearInterval(timer);
      instance.destroy();
      navigate('/')
      window.location.reload();
    }, secondsToGo * 1000);
  };

  useEffect(() => {
    if (id) {
      fecth_detail();
    } else {
      let start = localStorage.getItem("startDate");
      let end = localStorage.getItem("endDate");
      let numcat = parseInt(JSON.parse(localStorage.getItem("number_of_cats")));
      let totalday = Math.abs(new Date(end) - new Date(start)) / 86400000;
      let numcamera = parseInt(
        JSON.parse(localStorage.getItem("number_of_cameras"))
      );

      let get_user = JSON.parse(localStorage.getItem("user-provider"));

      if (get_user === null || get_user === "") {
        navigate("/login");
      } else {
        api.getOneRoom(type)
          .then((response) => {
            setTotal(Math.ceil(numcat / response.data.body.number_of_cats));
            setData(response.data.body);
          })
          .catch((err) => {
            console.log("An error occurred. Please try again.", err);
          })
          .finally(() => {
            setLoading(false);
            setUsername(get_user.first_name + " " + get_user.last_name);
            setEmail(get_user.email);
            setPhone(get_user.phone);
            if (start && end && numcat) {
              setStartDate(start);
              setEndDate(end);
              setNumcat(numcat);
              setTotalday(totalday);
              setNumcamera(numcamera);
            }
          });
      }
    }
  }, []);

  let fecth_detail = async () => {
    api.getOneBookingById(id)
      .then((res) => {
        setData(res.data.body);
        const checkInDate = new Date(res.data.body.check_in_date);
        const checkOutDate = new Date(res.data.body.check_out_date);
        const totalDays = Math.abs(checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);
        setTotalday(totalDays);
        setSelectedPayment(res.data.body.pay_way);
        let admin = JSON.parse(localStorage.getItem("user-provider")).pos;
        setPosition(admin);
        if (admin === "admin") {
          setPhone2(res.data.body.phone_2);
          setUsername2(res.data.body.user_name_2);
          setSpecialRequest(res.data.body.special_request);
          setUpload_slip(res.data.body.image);
        }
      })
      .catch((err) => {
        console.log("An error occurred. Please try again.", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  let handleOk = async (edit) => {
    try {
      if (upload_slip instanceof Blob) {
        const reader = new FileReader();
        reader.readAsDataURL(upload_slip);

        reader.onloadend = async function () {
          const img = reader.result;
          if (!edit) {
            await proceedWithPurchase(img);
          } else {
            await proceedWithEdit(img);
          }
        };

        reader.onerror = async function (err) {
          console.log("File reading failed:", err);
          if (!edit) {
            await proceedWithPurchase(null);
          } else {
            await proceedWithEdit(null);
          }
        };
      } else {
        if (!edit) {
          await proceedWithPurchase(null);
        } else {
          await proceedWithEdit(null);
        }
      }
    } catch (err) {
      console.log("An error occurred. Please try again.", err);
    }
  };

  let proceedWithEdit = async (img) => {
    let item = {
      user_name_2: username2,
      phone_2: phone2,
      special_request: special_request,
      pay_way: selectedPayment,
      image: selectedPayment === "credit" ? img : "",
    };
    try {
      const res = await api.updateBooking(id, item);
      console.log("Success", res);
    } catch (err) {
      console.log("An error occurred. Please try again.", err);
    } finally {
      setLoading(false);
      countDown();
    }
  };

  let proceedWithPurchase = async (img) => {
    let item = {
        room_name: data.room_name,
        type: data.type,
        user_name: username,
        user_name_2: username2,
        phone_2: phone2,
        email: email,
        phone: phone,
        special_request: special_request,
        check_in_date: new Date(startDate).toISOString(),
        check_out_date: new Date(endDate).toISOString(),
        total_price: data.price * totalday * total+ numcamera*50*totalday,
        total_cats: nunmcat,
        total_rooms: total,
        pay_way: selectedPayment,
        status: "pending",
        total_cameras: numcamera,
        image: selectedPayment === "credit" ? img : "",
    };

    try {
      const response = await api.createBooking(item);
      console.log(response.data);
    } catch (err) {
      console.log("An error occurred. Please try again.", err);
    } finally {
      setLoading(false);
      countDown();
    }
  };

  return (
    <>
      {loading ? (
        <>
          <LoadingSpinner />
        </>
      ) : (
        <>
          {contextHolder}
          <div className="p-4 md:p-20 bg-[#EAEDF1] flex flex-col md:flex-row justify-center items-start">
            <div className="w-full md:w-1/2">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between text-left md:text-center">
                <div className="text-left mb-4 md:mb-0">
                  <h1 className="text-2xl md:text-3xl">
                    {data.room_name ?? data.room_name}
                  </h1>
                  <p className="text-xs text-gray-600">
                    ห้องพัก {data.room_name ?? data.room_name}
                  </p>
                  <p className="text-xs text-gray-600">
                    เริ่มเช็คอิน : จาก: 08:00 ถึง เวลาเช็คเอาท์ : 17:00
                  </p>
                  <p className="text-xs text-gray-600">
                    โดย {data.description ?? data.description}
                  </p>
                </div>

                {data.image ? (
                  <>
                    {/* Mobile Version */}
                    <img
                      key="mobile"
                      src={data.image}
                      className="rounded-lg shadow-lg mb-4 w-full md:hidden" // Visible on mobile only
                      alt={data.type}
                    />

                    {/* Desktop Version */}
                    <img
                      key="desktop"
                      src={data.image}
                      className="rounded-xl shadow-lg mb-4 md:mb-0 hidden md:block" // Visible on desktop only
                      alt={data.type}
                      width={150}
                      height={150}
                    />
                  </>
                ) : (
                  <div className="placeholder sm:text-center sm:py-4 md:py-0">No Images</div>
                )}


              </div>
              <div className="bg-gray-200 p-4 rounded-md mt-4 flex flex-col md:flex-row items-center justify-around text-left">
                {/* Mobile Version */}
                <div className="md:hidden">
                  <div className="grid grid-cols-2 gap-20 mb-4">
                    <div className="flex flex-col items-start">
                      <p>เช็คอิน</p>
                      <p className="font-semibold">
                        {id ? (
                          <>{dayjs(data.check_in_date).format("DD/MM/YYYY")}</>
                        ) : (
                          <>{dayjs(startDate).format("DD/MM/YYYY")}</>
                        )}
                      </p>
                      <p>8.00</p>
                    </div>
                    <div className="flex flex-col items-start">
                      <p>เช็คเอาท์</p>
                      <p className="font-semibold">
                        {id ? (
                          <>{dayjs(data.check_out_date).format("DD/MM/YYYY")}</>
                        ) : (
                          <> {dayjs(endDate).format("DD/MM/YYYY")}</>
                        )}
                      </p>
                      <p>17.00</p>
                    </div>
                  </div>
                  <div className="px-4 py-2 mb-4 bg-[#A2A7A7] items-center text-white text-center justify-center flex rounded-lg">
                    <p className="font-semibold">
                      {id ? totalday : totalday} คืน
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="font-semibold">
                      แมว {id ? data.total_cats : nunmcat}
                      {" - "}กล้อง {id ? data.total_cameras : numcamera}
                    </p>
                  </div>
                </div>

                {/* Desktop Version */}
                <div className="hidden md:flex flex-col md:flex-row items-center justify-around w-full text-left">
                  <div>
                    <p>เช็คอิน</p>
                    <p className="font-semibold">
                      {id ? (
                        <>{dayjs(data.check_in_date).format("DD/MM/YYYY")}</>
                      ) : (
                        <>{dayjs(startDate).format("DD/MM/YYYY")}</>
                      )}
                    </p>
                    <p>8.00</p>
                  </div>
                  <div className="px-4 py-2 mt-4 md:mt-0 bg-[#A2A7A7] items-center text-white text-center justify-center flex rounded-lg">
                    <p className="font-semibold">


                    {id ? totalday : totalday } วัน{" "}

                    {id ? totalday : totalday } คืน

                    </p>
                  </div>
                  <div>
                    <p>เช็คเอาท์</p>
                    <p className="font-semibold">
                      {id ? (
                        <>{dayjs(data.check_out_date).format("DD/MM/YYYY")}</>
                      ) : (
                        <> {dayjs(endDate).format("DD/MM/YYYY")}</>
                      )}
                    </p>
                    <p>17.00</p>
                  </div>
                  <div>
                    <p className="font-semibold">
                      แมว {id ? data.total_cats : nunmcat}
                      {" - "}กล้อง {id ? data.total_cameras : numcamera}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mt-4">
                <h4 className="text-lg font-medium mb-2">ผู้จอง</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="ชื่อ"
                    value={id ? data.user_name : username}
                    readOnly
                    onChange={(e) => setUsername(e.target.value)}
                    className="border border-gray-300 rounded p-2"
                  />
                  <input
                    type="email"
                    placeholder="อีเมล"
                    value={id ? data.email : email}
                    readOnly
                    onChange={(e) => setEmail(e.target.value)}
                    className="border border-gray-300 rounded p-2"
                  />
                  <input
                    type="text"
                    placeholder="เบอร์โทรศัพท์"
                    value={id ? data.phone : phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="border border-gray-300 rounded p-2"
                  />
                </div>
                <h4 className="text-lg font-medium mb-2">ผู้รับ-ฝาก</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="ชื่อ"
                    value={
                      id
                        ? pos === "admin"
                          ? username2
                          : data.user_name_2
                        : username2
                    }
                    onChange={(e) => setUsername2(e.target.value)}
                    className="border border-gray-300 rounded p-2"
                  />
                  <input
                    type="text"
                    placeholder="เบอร์โทรศัพท์"
                    value={
                      id ? (pos === "admin" ? phone2 : data.phone_2) : phone2
                    }
                    onChange={(e) => setPhone2(e.target.value)}
                    className="border border-gray-300 rounded p-2"
                  />
                </div>
                <div className="mt-4">
                  <h4 className="text-lg font-medium mb-2">
                    คำขอพิเศษ (เพิ่มเติม)
                  </h4>
                  <textarea
                    className="w-full border border-gray-300 rounded p-2"
                    rows="4"
                    value={
                      id
                        ? pos === "admin"
                          ? special_request
                          : data.special_request
                        : special_request
                    }
                    onChange={(e) => setSpecialRequest(e.target.value)}
                    placeholder="กรอกคำขอพิเศษเพิ่มเติม..."
                  ></textarea>
                </div>
              </div>
              {!id ? (
                <button
                  onClick={() => handleOk(false)}
                  className="hidden md:block px-4 py-2 text-white rounded-sm mt-4 bg-[#55605B] hover:bg-[#A2A7A7]"
                >
                  ยืนยันการจอง
                </button>
              ) : (
                <>
                  {pos === "admin" ? (
                    <button
                      onClick={() => handleOk(true)}
                      className="px-4 py-2 text-white rounded-sm mt-4 bg-[#55605B] hover:bg-[#A2A7A7]"
                    >
                      ยืนยันการแก้ไข
                    </button>
                  ) : (
                    ""
                  )}
                </>
              )}
            </div>

            <div className="w-full md:w-auto mx-auto mt-4 md:mt-0">
              <div className="items-center space-y-2 mb-4">
                <div className="flex justify-between space-x-4 md:space-x-24">
                  <p className="text-gray-500 text-sm">
                    {total} ห้อง {" - "}
                    {id ? totalday : totalday - 1} คืน
                  </p>
                  <p className="text-gray-500 text-sm">
                    {id ? data.total_price : data.price * totalday} บาท
                  </p>
                </div>
                <div className="flex justify-between space-x-4 md:space-x-24">
                  <p className="text-gray-500 text-sm">ราคาส่วนลด</p>
                  <p className="text-gray-500 text-sm">0.00 บาท</p>
                </div>
                <div className="flex justify-between space-x-4 md:space-x-24">
                  <p className="text-gray-500 text-sm">ราคาหลังจากได้รับส่วนลด</p>
                  <p className="text-gray-500 text-sm">0.00 บาท</p>
                </div>
                <div className="flex justify-between space-x-4 md:space-x-24">
                  <p className="text-gray-500 text-sm">ภาษี & ค่าบริการ</p>
                  <p className="text-gray-500 text-sm">{numcamera*50*totalday}บาท</p>
                </div>
                <div className="flex justify-between space-x-4 md:space-x-24">
                  <p className="text-black text-lg font-semibold">ราคาทั้งหมด</p>
                  <p className="text-black text-lg font-semibold">
                    {data && id ? data.total_price : data.price * totalday * total+ numcamera*50*totalday} บาท
                  </p>
                </div>
                <div className="space-y-4 p-4 md:p-6 mt-3">
                  <h4 className="text-lg font-medium mb-2">ชำระเงิน</h4>
                  <button
                    onClick={() => handleSelectPayment("walk-in")}
                    className={`${selectedPayment === "walk-in" ? "border-blue-500" : ""
                      } bg-white hover:border-blue-500 w-full md:w-96 h-16 items-center justify-between px-4 flex border rounded-lg`}
                  >
                    <div className="w-12">
                      <PaymentsIcon />
                    </div>
                    <p>ชำระเงินสด</p>
                    <ArrowForwardIosIcon />
                  </button>
                  <button
                    onClick={() => handleSelectPayment("credit")}
                    className={`${selectedPayment === "credit" ? "border-blue-500" : ""
                      } bg-white hover:border-blue-500 w-full md:w-96 h-16 items-center justify-between px-4 flex border rounded-lg`}
                  >
                    <img src={PromtPay} alt="1" className="h-12 w-12" />
                    <p>พร้อมเพย์</p>
                    <ArrowForwardIosIcon />
                  </button>

                </div>
              </div>
              {selectedPayment === "credit" && (
                <div className="w-full h-64 items-center justify-center text-center flex">
                  {id ? (
                    <>
                      {pos === "admin" ? (
                        <>
                          {!upload && (
                            <React.Fragment>
                              <div>
                                <button
                                  className=""
                                  variant="outlined"
                                  onClick={handleClickOpen}
                                >
                                  <img
                                    src={upload_slip}
                                    alt="Uploaded"
                                    width={160}
                                    height={160}
                                  />
                                </button>
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
                                  <DialogContent>
                                    <DialogContentText>
                                      <img
                                        src="https://www.paocloud.co.th/wp-content/uploads/2021/01/Screen-Shot-2564-01-26-at-18.56.53.png"
                                        alt="QR code"
                                        width={250}
                                        height={250}
                                      />
                                    </DialogContentText>
                                    <div className="w-full text-center space-y-2 mb-2">
                                      <div className="flex justify-center space-x-2">
                                        <p className="font-semibold">
                                          จำนวนเงิน
                                        </p>
                                        <p>{data && id ? data.total_price : data.price * totalday * total+ numcamera*50*totalday} บาท</p>
                                      </div>
                                    </div>
                                    <input
                                      autoFocus
                                      required
                                      margin="dense"
                                      id="paymentSlip"
                                      name="paymentSlip"
                                      type="file"
                                      accept="image/*"
                                      className="w-60 px-4 py-1"
                                    />
                                  </DialogContent>
                                  <DialogActions>
                                    <div className="space-x-4">
                                      <button
                                        onClick={handleClose}
                                        className="bg-gray-100 hover:bg-gray-50 px-4 py-1 border border-gray-300 rounded-sm"
                                      >
                                        ยกเลิก
                                      </button>
                                      <button
                                        type="submit"
                                        className="bg-gray-100 hover:bg-gray-50 px-4 py-1 border border-gray-300 rounded-sm"
                                      >
                                        อัพโหลด
                                      </button>
                                    </div>
                                  </DialogActions>
                                </Dialog>
                              </div>
                            </React.Fragment>
                          )}
                          {upload && (
                            <React.Fragment>
                              <div>
                                <button
                                  className=""
                                  variant="outlined"
                                  onClick={handleClickOpen}
                                >
                                  <img
                                    src={URL.createObjectURL(upload_slip)}
                                    alt="Uploaded"
                                    width={160}
                                    height={160}
                                  />
                                </button>
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
                                  <DialogContent>
                                    <DialogContentText>
                                      <img
                                        src="https://www.paocloud.co.th/wp-content/uploads/2021/01/Screen-Shot-2564-01-26-at-18.56.53.png"
                                        alt="QR code"
                                        width={250}
                                        height={250}
                                      />
                                    </DialogContentText>
                                    <div className="w-full text-center space-y-2 mb-2">
                                      <div className="flex justify-center space-x-2">
                                        <p className="font-semibold">
                                          จำนวนเงิน
                                        </p>
                                        <p>{data && id ? data.total_price : data.price * totalday * total+ numcamera*50*totalday} บาท</p>
                                      </div>
                                    </div>
                                    <input
                                      autoFocus
                                      required
                                      margin="dense"
                                      id="paymentSlip"
                                      name="paymentSlip"
                                      type="file"
                                      accept="image/*"
                                      className="w-60 px-4 py-1"
                                    />
                                  </DialogContent>
                                  <DialogActions>
                                    <div className="space-x-4">
                                      <button
                                        onClick={handleClose}
                                        className="bg-gray-100 hover:bg-gray-50 px-4 py-1 border border-gray-300 rounded-sm"
                                      >
                                        ยกเลิก
                                      </button>
                                      <button
                                        type="submit"
                                        className="bg-gray-100 hover:bg-gray-50 px-4 py-1 border border-gray-300 rounded-sm"
                                      >
                                        อัพโหลด
                                      </button>
                                    </div>
                                  </DialogActions>
                                </Dialog>
                              </div>
                            </React.Fragment>
                          )}
                        </>
                      ) : (
                        <div className="justify-center items-center text-center flex h-72">
                          <img
                            src={data.image}
                            alt="Uploaded"
                            width={160}
                            height={160}
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {upload && (
                        <React.Fragment>
                          <div>
                            <button
                              className=""
                              variant="outlined"
                              onClick={handleClickOpen}
                            >
                              <img
                                src={URL.createObjectURL(upload_slip)}
                                alt="Uploaded"
                                width={160}
                                height={160}
                              />
                            </button>
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
                              <DialogContent>
                                <DialogContentText>
                                  <img
                                    src="https://www.paocloud.co.th/wp-content/uploads/2021/01/Screen-Shot-2564-01-26-at-18.56.53.png"
                                    alt="QR code"
                                    width={250}
                                    height={250}
                                  />
                                </DialogContentText>
                                <div className="w-full text-center space-y-2 mb-2">
                                  <div className="flex justify-center space-x-2">
                                    <p className="font-semibold">
                                      จำนวนเงิน
                                    </p>
                                    <p>{data && id ? data.total_price : data.price * totalday * total+ numcamera*50*totalday} บาท</p>
                                  </div>
                                </div>
                                <input
                                  autoFocus
                                  required
                                  margin="dense"
                                  id="paymentSlip"
                                  name="paymentSlip"
                                  type="file"
                                  accept="image/*"
                                  className="w-60 px-4 py-1"
                                />
                              </DialogContent>
                              <DialogActions>
                                <div className="space-x-4">
                                  <button
                                    onClick={handleClose}
                                    className="bg-gray-100 hover:bg-gray-50 px-4 py-1 border border-gray-300 rounded-sm"
                                  >
                                    ยกเลิก
                                  </button>
                                  <button
                                    type="submit"
                                    className="bg-gray-100 hover:bg-gray-50 px-4 py-1 border border-gray-300 rounded-sm"
                                  >
                                    อัพโหลด
                                  </button>
                                </div>
                              </DialogActions>
                            </Dialog>
                          </div>
                        </React.Fragment>
                      )}
                      {!upload && (
                        <div className="justify-center items-center text-center flex h-72">
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
                              <DialogContent>
                                <DialogContentText>
                                  <img
                                    src="https://www.paocloud.co.th/wp-content/uploads/2021/01/Screen-Shot-2564-01-26-at-18.56.53.png"
                                    alt="QR code"
                                    width={250}
                                    height={250}
                                  />
                                </DialogContentText>
                                <div className="w-full text-center space-y-2 mb-2">
                                  <div className="flex justify-center space-x-2">
                                    <p className="font-semibold">
                                      จำนวนเงิน
                                    </p>
                                    <p>{data && id ? data.total_price : data.price * totalday * total+ numcamera*50*totalday} บาท</p>
                                  </div>
                                </div>
                                <input
                                  autoFocus
                                  required
                                  margin="dense"
                                  id="paymentSlip"
                                  name="paymentSlip"
                                  type="file"
                                  accept="image/*"
                                  className="w-60 px-4 py-1"
                                />
                              </DialogContent>
                              <DialogActions>
                                <div className="space-x-4">
                                  <button
                                    onClick={handleClose}
                                    className="bg-gray-100 hover:bg-gray-50 px-4 py-1 border border-gray-300 rounded-sm"
                                  >
                                    ยกเลิก
                                  </button>
                                  <button
                                    type="submit"
                                    className="bg-gray-100 hover:bg-gray-50 px-4 py-1 border border-gray-300 rounded-sm"
                                  >
                                    อัพโหลด
                                  </button>
                                </div>
                              </DialogActions>
                            </Dialog>
                          </React.Fragment>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {selectedPayment === "walk-in" && (
                <div className="w-full h-64 items-center justify-center text-center flex">
                  <h1>เมื่อเดินทางมาถึงที่พัก กรุณาชำระเงินที่หน้าเคาเตอร์</h1>
                </div>
              )}
              <div className="flex justify-center">
                <button
                  onClick={() => handleOk(false)}
                  className="px-4 py-2 text-base font-semibold text-white rounded-md mt-4 bg-[#55605B] hover:bg-[#A2A7A7] mx-auto block md:hidden" // Visible on mobile only
                >
                  ยืนยันการจอง
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
