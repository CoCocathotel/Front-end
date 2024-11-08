/* eslint-disable jsx-a11y/alt-text */
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS CSS
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../component/Loading";
import Label from "../../component/Label";
import Bg from "../../assets/image/bg.png";
import BgRule from "../../assets/image/bg-rule.png";
import CardCat from "../../assets/image/cardcat.png";
import CardFood from "../../assets/image/cardfood.png";
import CardSand from "../../assets/image/cardsand.png";
import Card from "../../component/Card";
import { FeetIcon } from "../../constant/SvgImg";

export default function Rule() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState([]);
  const [timeCheckin, setTimCheckIn] = useState([]);
  const [timeCheckout, setTimCheckOut] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 1000 });
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
    setLoading(false);
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <>
      <div
        className="min-h-screen flex flex-col items-center justify-center bg-[#F0F8FF] bg-center bg-cover"
        style={{
          backgroundImage: `url(${Bg})`,
        }}
      >
        {/* Background with Title */}
        <div className="relative w-full" data-aos="fade-up">
          <img
            src={BgRule}
            alt=""
            className="max-h-max object-cover rounded-lg shadow-lg w-full"
          />
          <div className="absolute inset-0 bg-black opacity-50 z-40"></div>

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 z-50 -translate-y-1/2 text-white p-4 md:p-20 w-full text-center md:text-left">
            <h1 className="text-4xl md:text-9xl font-bold">กฎกติกาการเข้าพัก</h1>
            <h2 className="text-2xl md:text-5xl">
              และสิ่งที่ต้องเตรียมมาเพื่อดูแลน้องแมว
            </h2>
          </div>
        </div>

        {/* Rule Label */}
        <Label label={"เงื่อนไขและข้อตกลงการเข้าพักน้องแมว"} data-aos="fade-up" />

        {/* Rules Details */}
        <div className="relative w-full lg:w-1/2 min-h-screen p-4 lg:p-14">
          {/* Blue Background Section */}
          <div
            className="absolute inset-0 bg-[#8DAFCB] rounded-lg shadow-md z-0"
            data-aos="fade-up"
          ></div>

          {/* White Smaller Rectangle (centered and 10% smaller) */}
          <div
            className="absolute inset-0 bg-white rounded-lg shadow-md z-10"
            style={{
              width: '90%', // 10% smaller
              height: '90%', // 10% smaller
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)', // Centering the white rectangle
            }}
          ></div>

          {/* Content Section */}
          <div className="relative z-20 grid grid-cols-1 gap-4 justify-center p-2 lg:p-14 max-w-full mt-4"> {/* Adjusted margin */}
            {title.map((item, index) => (
              <div key={index} className="w-full p-2" data-aos="fade-up">
                <div className="shadow-lg rounded-2xl h-full flex items-center text-lg bg-[#EDF2F9] bg-opacity-90 p-2 lg:p-4 transition-transform transform hover:scale-105">
                  <FeetIcon />
                  <span className="ml-2">{item}</span>
                </div>
              </div>
            ))}

            {/* Check-in Time */}
            <div className="p-2" data-aos="fade-up">
              <div className="shadow-lg rounded-2xl h-full text-xl bg-[#EDF2F9] bg-opacity-90 p-2 lg:p-4 transition-transform transform hover:scale-105">
                {timeCheckin.map((item, index) => (
                  <div key={index} className="w-full space-x-4 p-2 flex items-center">
                    <FeetIcon />
                    <h1>รับเช็คอินในช่วงเวลาบริการ</h1>
                    <span>{item.checkin}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Check-out Time */}
            <div className="p-2" data-aos="fade-up">
              <div className="shadow-lg rounded-2xl h-full text-xl bg-[#EDF2F9] bg-opacity-90 p-2 lg:p-4 transition-transform transform hover:scale-105">
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
        <div className="w-full relative flex-wrap justify-center items-start p-10 space-x-4 overflow-hidden" data-aos="fade-up">
          <div className="items-start justify-start relative">
            <div className="absolute w-full h-full opacity-95"></div>
            <div className="flex flex-col md:flex-row items-center justify-center">
              <Card
                card={CardCat}
                head={"สมุดวัคซีนประจำตัวน้องแมว"}
                desc={"สามารถนำสมุดวัคซีนประจำตัวน้องแมวตัวจริงมา ยืนยัน หรือยืนยันด้วยรูปถ่ายสมุดวัคซีน"}
                w={"w-72 md:w-96"}
              />
              <Card
                card={CardFood}
                head={"อาหารของน้องแมว"}
                desc={"เตรียมาในปริมาณพอเหมาะกับ จำนวนคืนที่พักและ จำนวนของน้องแมว"}
                w={"w-44"}
              />
            </div>

            <div className="flex flex-col md:flex-row">
              <Card
                card={CardSand}
                head={"ทรายแมว"}
                desc={"โรงแรมแนะนำให้เป็นทรายเต้าหู้แมว ช่วยเรื่องเก็บกลิ่นและฝุ่น"}
                w={"w-60 md:w-72"}
                flex={"flex"}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
