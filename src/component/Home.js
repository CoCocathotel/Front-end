import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Logo from "../cococat-hotel.png";
import Img_bg from "../cococat_preview.jpg";
import LoadingSpinner from "./Loading";
import TikTokEmbed from "./Tiktok1";

import Appbar_master from "../Appbar_master";

import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
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
import EmailIcon from "@mui/icons-material/Email";
import EmailTwoToneIcon from "@mui/icons-material/EmailTwoTone";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";

export default function Home() {
  const navigate = useNavigate();

  const images = [Img_bg, Img_bg, Img_bg];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  const [loading, setLoading] = useState(true);

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
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  return (
    <>
      {loading ? (
        <div>
          <LoadingSpinner />
        </div>
      ) : (
        <div>
          <div className="sticky top-0 bg-white z-50">
          <Appbar_master />
          </div>

          <hr />

          <div>
            {/* {หน้า Home โรงแรมแมว} */}
            <div className="flex flex-col items-center justify-center  bg-gray-200 overflow-hidden">
              <div className="bg-white p-5 rounded-lg shadow-lg w-screen overflow-hidden">
                <div className="flex w-[200%] animate-slide">
                  {" "}
                  {/* ใช้ flex และ width 200% เพื่อแสดงผลสไลด์ */}
                  {images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Slide ${index}`}
                      className="w-1/3"
                    />
                  ))}
                  {images.map((image, index) => (
                    <img
                      key={index + images.length}
                      src={image}
                      alt={`Slide Duplicate ${index}`}
                      className="w-1/3"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="text-3xl text-left text-black ml-5 mt-10 mb-10">
              Our Faclities
            </div>
            <div className="flex bg-white shadow-sm  justify-between ">
              <div className="  justify-center text-start space-x-4 p-5 items-center flex ">
                <img
                  className="w-44"
                  src="https://szrepoqlfkcnlfdeicse.supabase.co/storage/v1/object/public/rooms/fan-room/0.png"
                  alt=""
                />

                <div>
                  <h1>Play RoomS</h1>
                  <p>
                    Lorem ipsum odor amet, consectetuer adipiscing elit. Libero
                    ut litora dolor quisque aliquet.
                  </p>
                </div>
              </div>
              <div className=" justify-center text-start space-x-4 p-5 items-center flex ">
                <img
                  className="w-44 h-44"
                  src="https://szrepoqlfkcnlfdeicse.supabase.co/storage/v1/object/public/rooms/fan-room/0.png"
                  alt=""
                />
                <div>
                  <h1>Play RoomS</h1>
                  <p>
                    Lorem ipsum odor amet, consectetuer adipiscing elit. Libero
                    ut litora dolor quisque aliquet.
                  </p>
                </div>
              </div>
              <div className=" justify-center text-start space-x-4 p-5 items-center flex  ">
                <img
                  className="w-44 h-44"
                  src="https://szrepoqlfkcnlfdeicse.supabase.co/storage/v1/object/public/rooms/fan-room/0.png"
                  alt=""
                />
                <div>
                  <h1>Play RoomS</h1>
                  <p>
                    Lorem ipsum odor amet, consectetuer adipiscing elit. Libero
                    ut litora dolor quisque aliquet.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <hr />

          <div>
            <div className="text-3xl text-left text-black ml-5 mt-10 mb-10">
              Our Social Media
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="min-h-screen  flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold mb-4">
                  Watch This TikTok Video
                </h1>
                <TikTokEmbed
                  url={"https://www.tiktok.com/embed/7292001456092220678"}
                />
              </div>
              <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold mb-4">
                  Watch This TikTok Video
                </h1>
                <TikTokEmbed
                  url={"https://www.tiktok.com/embed/7378412182633041153"}
                />
              </div>
              <div className="min-h-screen  flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold mb-4">
                  Watch This TikTok Video
                </h1>
                <TikTokEmbed
                  url={"https://www.tiktok.com/embed/7378408740363472145"}
                />
              </div>
            </div>
          </div>

          <hr className="mt-20" />

          {/* <div className="bg-white p-5 rounded-lg text-center shadow-lg w-full my-4">
            <div className="text-black text-3xl text-left mt-10 mb-10">
              {" "}
              Term of Use
            </div>
            <div className="grid grid-cols-3 gap-4 mb-20">
              <div className="border-2 border-gray-400 px-4 py-5 border-opacity-50 rounded-sm	">
                <p className="text-left text-green-400 mb-5">การจองห้องพัก</p>
                <p className="text-left text-gray-400 mb-5">
                  Confirm วัน เวลาที่จะมาส่งและมารับน้อง เลือกห้องพักที่ต้องการ
                  (หรือห้องที่ว่างอยู่) การจองห้องพักจะต้องมีการมัดจำ 50%
                  ของยอดรวมค่าพัก ส่วนยอดคงเหลือ นำมาชำระในวันที่ส่งน้องแมวค่ะ
                  (การจองห้องที่ไม่มีการโอนเงินมัดจำ
                  เราจะถือว่ายังไม่มีการจองห้องเกิดขึ้นนะค่ะ)
                  สำหรับในช่วงเทศกาลปีใหม่และสงกรานต์
                  รบกวนโอนยอดค่าเข้าพักทั้งหมดเต็มจำนวนค่ะ
                </p>

                <ul className="text-left text-gray-400 mr-10 ml-10 mb-5">
                  <li className="mb-5">
                    1. กรณีการยกเลิกห้องพัก สามารถยกเลิกได้ 15 วัน
                    ก่อนวันเข้าพัก คืนเงินมัดจำให้ทั้งหมดค่ะ
                  </li>
                  <li className="mb-5">
                    2. กรณีเพิ่มวันพัก โดยไม่แจ้งล่วงหน้า
                    และห้องของทางโรงแรมเต็มทุกห้องในวันนั้น
                    เราขอนำน้องแมวออกมาพักในที่พักชั่วคราว
                    ซึ่งเป็นที่พักสำรองของทางเราค่ะ
                    โดยคิดค่าใช้จ่ายตามราคาห้องปกติค่ะ
                  </li>
                  <li className="mb-5">
                    3. การลดจำนวนวันพัก โดยไม่แจ้งล่วงหน้า
                    ทางเรารบกวนไม่คืนเงินในส่วนวันที่เหลือค่ะ
                  </li>
                </ul>

                <p className="text-left text-green-400 mb-5">บัญชีธนาคาร</p>

                <ul className="text-left text-gray-400 mr-10 ml-10">
                  <li className="text-left text-gray-400">
                    ชื่อบัญชี ปวีณา <br />
                    วิบูลย์สันติพงศ์ ไทยพาณิชย์
                    <br />
                    เลขที่บัญชี 085-225160-3
                    <br />
                    ออมทรัพย์ สาขาประชานิเวศน์ 1
                  </li>
                </ul>
              </div>

              <div className="border-2 border-gray-400 px-4 py-5 border-opacity-50 rounded-sm	">
                <p className="text-left text-green-400 mb-5">
                  เงื่อนไขการจองห้องพัก
                </p>
                <ul className="text-left text-gray-400 mr-10 ml-10 ">
                  <li className="mb-5">
                    น้องแมวทุกตัวต้องได้รับการฉีดวัคซีนป้องกันโรคขั้นพื้นฐาน
                    (โรคพิษสุนัขบ้า โรคลิวคิเมีย โรคหัดแมว)
                    โดยนำใบวัคซีนมาให้ในวันส่งน้องค่ะ
                  </li>

                  <li className="mb-5">ต้องมีอายุ 3 เดือนขึ้นไป</li>

                  <li className="mb-5">
                    เป็นแมวที่เลี้ยงมาจากระบบปิดเท่านั้น (ระบบปิด หมายถึง
                    เลี้ยงในบ้านเท่านั้น) เพื่อป้องกันในเรื่องของเห็บ หมัด
                    และพาหะโรคต่างๆ ที่จะแพร่สู่น้องแมวตัวอื่นๆได้ค่ะ
                  </li>

                  <li className="mb-5">
                    กรณีน้องแมวป่วยระหว่างพักกับเรา จะแจ้งให้เจ้าของทราบโดยทันที
                    และสามารถพาน้องแมวไปโรงพยาบาลสัตว์ได้ค่ะ
                    (ค่าใช้จ่ายตามบิลของโรงพยาบาล)
                  </li>

                  <li className="mb-5">
                    หากน้องแมวเสียชีวิต หรือป่วยในระหว่างพักหรือหลังพัก
                    ทางเราไม่ขอรับผิดชอบใดๆทั้งสิ้น เพราะก่อนน้องแมวเข้าพัก
                    เราได้สอบถามประวัติทางด้านสุขภาพ
                    การฉีดวัคซีนของน้องแมวทุกๆตัวค่ะ ซึ่งในระหว่างที่พักกับเรา
                    เรามั่นใจในการดูแลในเรื่องความสะอาด ปลอดภัย
                    และสุขภาพอนามัยที่ดีค่ะ
                  </li>

                  <li className="mb-5">
                    กรุณาตัดเล็บให้น้องแมวก่อนมาส่งด้วยนะค่ะ
                  </li>
                </ul>

                <p className="text-left text-green-400">
                  ถ้าน้องแมวที่มาส่งมีเห็บ หมัด เราจะไม่รับฝากทุกกรณีค่ะ
                </p>
              </div>

              <div className="border-2 border-gray-400 px-4 py-5 border-opacity-50 rounded-sm">
                <p className="text-left text-green-400 mb-5">
                  สิ่งที่ต้องเตรียมมาในวันมาส่งน้องแมว
                </p>
                <ul className="text-left text-gray-400 mr-10 ml-10 ">
                  <li className="mb-5">ใบวัคซีน</li>
                  <li className="mb-5">สำเนาบัตรประชาชนเจ้าของแมว</li>
                  <li className="mb-5">อาหารที่น้องทานประจำ</li>
                  <li className="mb-5">
                    ทรายแมว (แต่ถ้าไม่สะดวกนำมาเอง เรามีแบ่งขายให้
                    ราคาตามท้องตลาดทั่วไป ส่วนกระบะทราย เรามีให้อยู่แล้วค่ะ)
                  </li>
                  <li className="mb-5">
                    ของเล่นที่น้องชอบ ผ้าหรือเบาะนอนที่น้องคุ้นเคย
                  </li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="border-2 border-gray-400 px-4 py-5 border-opacity-50 rounded-sm">
                <p className="text-left text-green-400 mb-5">
                  การรับ-ส่งน้องแมว
                </p>
                <ul className="text-left text-gray-400 mr-10 ml-10 ">
                  <li className="mb-5">
                    นัดเวลามาส่งและมารับน้องแมว กรุณาระบุเวลาทุกครั้งค่ะ
                  </li>
                  <li className="mb-5">
                    การมารับน้องแมว มารับได้ไม่เกิน 2 ทุ่ม หากเกินเวลานี้
                    ขอให้เพิ่มเวลาพักอีก 1 คืนและมารับน้องในวันถัดไปค่ะ
                    (เพื่อไม่ให้เป็นการรบกวนน้องแมวห้องอื่น
                    เพราะในเวลานี้น้องแมวส่วนใหญ่จะหลับพักผ่อนกันแล้วค่ะ)
                  </li>
                </ul>
              </div>

              <div className="border-2 border-gray-400 px-4 py-5 border-opacity-50 rounded-sm">
                <p className="text-left text-green-400 mb-5">
                  การสื่อสารในระหว่างที่น้องแมวมาพักกับเรา
                </p>
                <ul className="text-left text-gray-400 mr-10 ml-10 ">
                  <li>
                    ติดต่อโดยส่งรูปภาพและวิดิโอทางไลน์ (id: nekoluxury)
                    ทางเราจะมีการอัพเดตรายละเอียดของน้องวันเว้นวัน วันละ 1
                    ครั้งเท่านั้นค่ะ
                  </li>
                </ul>
              </div>

              <div className="border-2 border-gray-400 px-4 py-5 border-opacity-50 rounded-sm">
                <p className="text-left text-green-400 mb-5">การนัดเยี่ยมชม </p>
                <ul className="text-left text-gray-400 mr-10 ml-10 ">
                  <li className="mb-5">
                    โรงแรมแมวของเราเปิดเวลา 9.00-20.00น.
                    กรุณานัดหมายเข้าเยี่ยมชมล่วงหน้าค่ะ
                  </li>
                  <li className="mb-5">
                    การนัดหมายทุกประเภท กรุณาระบุเวลาและตรงต่อเวลาด้วยค่ะ
                    หากเปลี่ยนเวลานัดหมาย ขอความกรุณาแจ้งล่วงหน้าด้วยค่ะ
                  </li>
                  <li className="mb-5">
                    หากมีการทิ้งน้องแมว ทางเราจะดำเนินคดี ตาม พรบ.
                    คุ้มครองสัตว์ค่ะ{" "}
                  </li>
                </ul>
              </div>
            </div>
          </div> */}
        </div>
      )}
      <footer className=" bg-[#8CAFCB] p-14 mt-20  items-center justify-between text-center shadow-lg w-full">
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
  );
}
