/* eslint-disable jsx-a11y/alt-text */
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS CSS
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../component/Loading";
import service from "../../api/apiService";
import Label from "../../component/Label";
import ImgaeCat from "../../assets/image/hero1.png";
import ImageCat2 from "../../assets/image/hero2.png";
import Logo from "../../cococat-hotel.png";
import FeetBig from "../../assets/image/feetBig.png";
import Map from "../../assets/image/map.png";
import Bg from "../../assets/image/bg.png";
import FeetBlue from "../../assets/image/feet_blue.png";
import Review1 from "../../assets/image/Review1.png";
import Review2 from "../../assets/image/Review2.png";
import Review3 from "../../assets/image/Review3.png";
import FeetK from "../../assets/image/feet_kuay.png";
import BgRule from "../../assets/image/bg-rule.png";
import CardCat from "../../assets/image/cardcat.png";
import CardFood from "../../assets/image/cardfood.png";
import CardSand from "../../assets/image/cardsand.png";
import Card from "../../component/Card";
import { FeetIcon, FeetIcon2, Star } from "../../constant/SvgImg";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Carousel, Button, Result } from "antd";

export default function Rule() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState([]);
  const [timeCheckin, setTimCheckIn] = useState([]);
  const [timeCheckout, setTimCheckOut] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 1000 }); // Initialize AOS for animations

    service
      .api("/")
      .then((res) => {
        setTitle([
          "น้องแมวทุกตัวมีอายุ 4 เดือนขึ้นไป",
          "ฉีดวัคซีนรวม (ไข้หัด-หวัดแมว) ป้องกันพิษสุนัขบ้า มีสมุดวัคซีน",
          "ไม่มีเห็บ-หมัด หยอดยาป้องกันเห็บ-หมัดมาแล้ว",
          "ไม่ป่วยเป็นโรคติดต่อ เช่น เชื้อรา ไรขี้เรื้อน เป็นต้น",
          "ขอสงวนสิทธิ์ งดรับน้องแมวที่กำลังเป็นสัด หรือตั้งท้องแก่เข้าพัก",
        ]);
        setTimCheckIn([
          {
            checkin: "09:30 - 20:00",
            result: "",
          },
        ]);
        setTimCheckOut([
          { checkcout: "9:30 - 13:00 น.", result: "ไม่คิดเงินวันสุดท้าย" },
          {
            checkcout: "13:00 - 20:00 น.",
            result: " คิดค่าบริการเพิ่ม 1/2 ของราคาห้องพัก",
          },
        ]);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <>
      <div
        className="min-h-screen flex flex-col items-center justify-center bg-[#F0F8FF] "
        style={{
          backgroundImage: `url(${Bg})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
        }}
      >
        {/* Background with Title */}
        <div className="relative w-full" data-aos="fade-up">
          <img
            src={BgRule}
            alt=""
            className="max-h-max object-cover rounded-lg shadow-lg"
          />
          <div className="absolute inset-0 bg-black opacity-50 z-40"></div>

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 z-50 -translate-y-1/2 text-white p-20 w-full text-start">
            <h1 className="text-9xl font-bold">กฎกติกาการเข้าพัก</h1>  
            <h2 className="text-5xl">และสิ่งที่ต้องเตรียมมาเพื่อดูแลน้องแมว</h2>
          </div>
        </div>

        {/* Rule Label */}
        <Label label={"เงื่อนไขและข้อตกลงการเข้าพักน้องแมว"} data-aos="fade-up" />

        {/* Rules Details */}
        <div className="h-screen w-full relative flex justify-center items-start" >
          <div className="bg-[#8DAFCB] h-screen w-1/2 z-0 rounded-lg shadow-md relative" data-aos="fade-up">
            <div className="absolute bg-[#ffffff] h-full w-full z-10 scale-90 rounded-lg shadow-md opacity-50"></div>
          </div>
          <div className="absolute z-10 w-1/2 grid grid-cols-1 gap-0 justify-center p-14 top-0">
            {title.map((item, index) => (
              <div key={index} className="w-full p-1" data-aos="fade-up">
                <div className="space-x-4 shadow-lg rounded-2xl h-full flex items-center text-lg bg-[#EDF2F9] p-4 transition-transform transform hover:scale-105">
                  <FeetIcon />
                  <span className="ml-2">{item}</span>
                </div>
              </div>
            ))}
            <div className="p-1" data-aos="fade-up">
              <div className="shadow-lg rounded-2xl h-full text-xl bg-[#EDF2F9] p-4  transition-transform transform hover:scale-105">
                {timeCheckin.map((item, index) => (
                  <div key={index} className="w-full space-x-4 p-2 flex">
                    <FeetIcon />
                    <h1>รับเช็คอินในช่วงเวลาบริการ</h1>
                    <span>{item.checkin}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-1" data-aos="fade-up">
              <div className="shadow-lg rounded-2xl h-full text-xl bg-[#EDF2F9] p-4  transition-transform transform hover:scale-105">
                <h1>รับน้องกลับ</h1>
                {timeCheckout.map((item, index) => (
                  <div
                    key={index}
                    className="space-x-4 w-full items-center p-1 text-center flex"
                  >
                    <FeetIcon />
                    <span>{item.checkcout}</span>
                    <span>{item.result}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Cat Care Label */}
        <Label label={"สิ่งที่ต้องเตรียมมาเพื่อดูแลน้องแมว"} data-aos="fade-up" />

        {/* Cat Care Details */}
        <div className="h-auto w-full relative flex-wrap justify-center items-start p-10 space-x-4 overflow-hidden" data-aos="fade-up">
          <div className="items-start justify-start relative">
            <div className="absolute w-full h-full opacity-95"></div>
            <div className="flex items-center justify-center">
              <Card
                card={CardCat}
                head={"สมุดวัคซีนประจำตัวน้องแมว"}
                desc={"สามารถนำสมุดวัคซีนประจำตัวน้องแมวตัวจริงมา ยืนยัน หรือยืนยันด้วยรูปถ่ายสมุดวัคซีน"}
                w={"w-96"}
              />
              <Card
                card={CardFood}
                head={"อาหารของน้องแมว"}
                desc={"เตรียมาในปริมาณพอเหมาะกับ จำนวนคืนที่พักและ จำนวนของน้องแมว"}
                w={"w-44"}
              />
            </div>

            <div className="flex">
              <Card
                card={CardSand}
                head={"ทรายแมว"}
                desc={"โรงแรมแนะนำให้เป็นทรายเต้าหู้แมว ช่วยเรื่องเก็บกลิ่นและฝุ่น"}
                w={"w-72"}
                flex={"flex"}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
