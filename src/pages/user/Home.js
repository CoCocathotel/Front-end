/* eslint-disable jsx-a11y/alt-text */

import { useEffect, useState, useRef } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Carousel, Button } from "antd";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../component/Loading";
import service from "../../api/apiService";

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

export default function Home() {
  const navigate = useNavigate();

  const carouselRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ImgArray, setImgArray] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [room, setRoom] = useState([]);
  const [effectimg, setEffectImg] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideIndex, setSlideIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const itemsPerPage = 9;
  const totalPages = Math.ceil(reviews.flat().length / itemsPerPage);

  const currentReviews = reviews
    .flat()
    .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    service
      .api("/v1/room")
      .then((res) => {
        console.log(res);
        setImgArray([
          ImgaeCat,
          ImageCat2,
          ImgaeCat,
          ImageCat2,
          ImgaeCat,
          ImageCat2,
        ]);
        setReviews([
          [
            Review1,
            Review1,
            Review2,
            Review2,
            Review1,
            Review3,
            Review1,
            Review2,
            Review3,
          ],
          [
            Review1,
            Review2,
            Review2,
            Review1,
            Review2,
            Review2,
            Review1,
            Review2,
            Review2,
          ],
          [
            Review1,
            Review2,
            Review3,
            Review1,
            Review2,
            Review3,
            Review1,
            Review2,
            Review3,
          ],
        ]);
        setRoom(res.room);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleCarouselChange = (current) => {
    setCurrentIndex(current);
  };

  function swap(x, y) {
    const temp = x;
    x = y;
    y = temp;
    return [x, y];
  }

  const handleActiveIndex = (next) => {
    if (next >= 0 && next < room.length) {
      const updatedRoom = [...room];
      setEffectImg(true);

      const [swappedElement1, swappedElement2] = swap(
        updatedRoom[1],
        updatedRoom[next]
      );
      updatedRoom[1] = swappedElement1;
      updatedRoom[next] = swappedElement2;

      setTimeout(() => {
        setEffectImg(false);
        setRoom(updatedRoom);
      }, 500);

      console.log(
        updatedRoom[0].room_name,
        updatedRoom[1].room_name,
        updatedRoom[2].room_name
      );
    } else {
      console.error("Invalid index provided.");
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <>
      <div
        className="min-h-screen flex flex-col items-center justify-center bg-[#F0F8FF] relative"
        style={{
          backgroundImage: `url(${Bg})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
        }}
      >
        <div className="relative w-full ">
          <Carousel
            autoplay
            ref={carouselRef}
            arrows
            infinite={false}
            beforeChange={(from, to) => handleCarouselChange(to)}
          >
            {ImgArray.map((image, index) => (
              <div key={index}>
                <img
                  src={image}
                  alt={`image-${index}`}
                  className=" max-h-max object-cover rounded-lg shadow-lg"
                />
              </div>
            ))}
          </Carousel>
        </div>

        {/* ตัวบ่งชี้การเปลี่ยนสีตามรูป */}
        <div className="flex p-4 space-x-2 ">
          {ImgArray.map((_, index) => (
            <div key={index}>
              <div
                onClick={() => {
                  setCurrentIndex(index); // อัปเดต currentIndex
                  carouselRef.current.goTo(index); // ใช้เมธอด goTo เพื่อเปลี่ยนรูป
                }}
                className={
                  currentIndex === index
                    ? "max-w-md w-10 h-4 bg-[#B6D4F0] rounded-full shadow-lg cursor-pointer" // สีที่เน้นเมื่อตรงกับรูปที่แสดงอยู่
                    : "max-w-md w-4 h-4 bg-[#d7d7d7] rounded-full shadow-lg cursor-pointer" // สีพื้นหลังปกติ
                }
              ></div>
            </div>
          ))}
        </div>

        {/* cococat label */}
        <div className="items-center text-2xl flex w-10/12 h-48 mt-4 bg-[#B6D4F0] rounded-full shadow-lg p-4">
          <img src={Logo} alt="logo" width={200} height={120} />
          <p>
            Co-Co Cat Hotel โรงแรมแมว โค-โค่ แค็ท หาดใหญ่ ยินดีต้อนรับ {<br />}
            ต้องเดินทางไกลช่วงไหน…ฝากน้องแมวไว้กับเรา ดูแลน้องแมวห่วงใย
            ปลอดภัยโดยมืออาชีพ
          </p>
        </div>

        {/* lable room */}
        <div className=" justify-start w-full flex mt-20">
          <div className="items-left items-center w-1/2 flex max-w-md bg-[#3B82F6] rounded-r-full shadow-lg p-4">
            <p className="text-3xl text-white p-4">ห้องพักน้องแมว</p>
            <img src={FeetBig} alt="logo2" width={60} height={60} />
          </div>
        </div>

        {/* detail room */}
        <div className="relative w-full flex items-center justify-center">
          <div className="absolute flex items-end justify-center ">
            {room.map((item, index) => (
              <button
                key={index}
                onClick={() => handleActiveIndex(index)}
                className={`relative w-80 transition duration-300 ease-in-out overflow-hidden rounded-lg shadow-lg hover:blur-0   ${
                  effectimg === true
                    ? "blur-sm transition duration-300 ease-in-out scale-75"
                    : ""
                } ${index === 1 ? "scale-100 " : "scale-75 blur-sm "}`}
              >
                <img
                  src={`https://hiykwrlgoinmxgqczucv.supabase.co/storage/v1/object/public/rooms/${item.type}/${item.image[0]}`}
                  alt={item.room_name}
                  className="w-full h-full object-cover rounded-lg transition duration-300 ease-in-out"
                />

                {index === 1 && (
                  <div className="absolute bottom-0 w-full bg-[rgba(22, 48, 131, 0.8)] backdrop-blur-sm p-4 flex items-center justify-between">
                    <div className="w-52">
                      <h1 className="text-white font-bold">{item.room_name}</h1>
                      <p className="text-white text-sm">
                        รองรับน้องแมวได้ {item.number_of_cats} ตัว
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        navigate("/booking");
                      }}
                      className="bg-[#224683] hover:bg-[#202d42] text-white w-44 h-20 rounded-full px-4 py-2 flex items-center"
                    >
                      <h1 className="mr-2">ดูเพิ่มเติม</h1>
                      <img src={FeetBlue} alt="rom2" width={25} height={25} />
                    </button>
                  </div>
                )}
              </button>
            ))}
          </div>

          <svg
            width="1027"
            height="858"
            viewBox="0 0 1027 858"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M44.0979 654.441C44.0979 654.441 141.652 566.562 307.506 589.556C435.148 607.257 596.787 630.55 826.594 577.253C984.039 540.739 1026.39 633.06 1027 704.001C1027.64 780.021 940.908 837.48 766.419 844.433C597.612 851.154 160.977 874.457 65.4394 838.156C-30.0983 801.845 -6.40474 701.422 44.0979 654.441Z"
              fill="#B6D4F0"
            />
            <path
              d="M627.409 81.2729C627.409 81.2729 592.376 167.494 621.704 229.687C651.033 291.88 733.323 303.897 777.321 308.131C821.318 312.373 907.166 302.154 947.597 253.553C988.036 204.952 1002.99 134.276 973.666 87.635C944.329 40.9937 888.738 0.140613 809.756 0.000633429C708.973 -0.18134 641.327 38.873 627.409 81.2729Z"
              fill="#B6D4F0"
            />
          </svg>
        </div>

        {/* lable review */}
        <div className=" justify-start w-full flex">
          <div className="items-left items-center w-1/2 flex max-w-md bg-[#3B82F6] rounded-r-full shadow-lg p-4">
            <p className="text-3xl text-white p-4">รีวิวจากลูกค้า</p>
            <img src={FeetBig} alt="logo2" width={60} height={60} />
          </div>
        </div>

        {/* detail review */}

        <div className="relative">
          <button
            onClick={handlePrev}
            disabled={currentPage === 0}
            className={`absolute top-1/3 left-4 p-4 m-5 rounded-full z-30 opacity-80 shadow-md  hover:bg-[#16305C]  ${
              currentPage === 0 ? "bg-gray-300" : "bg-gray-300"
            } text-white`}
          >
            <ArrowBackIosIcon />
          </button>
          <svg
            className="absolute inset-0 items-center justify-center w-full h-full"
            width="1404"
            height="484"
            viewBox="0 0 1404 484"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="1404" height="484" rx="190" fill="#B6D4F0" />
          </svg>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages - 1}
            className={`absolute top-1/3 right-4 p-4 m-5 rounded-full z-30 opacity-80 shadow-md  hover:bg-[#16305C] ${
              currentPage === totalPages - 1 ? "bg-gray-300" : "bg-gray-300"
            } text-white`}
          >
            <ArrowForwardIosIcon />
          </button>

          <div className="relative grid grid-cols-2 gap-4 bg-[#8FA7BD] p-4 m-20 space-x-4 rounded-lg h-full">
            {/* Main Image Display */}

            <div className="h-36 z-10">
              <img src={reviews[activeIndex][slideIndex]} alt="Main Review" />
            </div>

            {/* Grid Display */}
            <div className="grid grid-cols-3 gap-1 grid-rows-3 h-96 z-20">
              {currentReviews.map((review, index) => (
                <button
                  onClick={() => {
                    const rowIndex = Math.floor(
                      (currentPage * itemsPerPage + index) / reviews[0].length
                    );
                    const reviewIndex =
                      (currentPage * itemsPerPage + index) % reviews[0].length;
                    setActiveIndex(rowIndex);
                    setSlideIndex(reviewIndex);
                  }}
                  key={index}
                  className="relative group"
                >
                  <img
                    className="w-full h-32 object-cover rounded-lg group-hover:opacity-75 transition duration-300"
                    src={review}
                    alt={`Review ${index}`}
                  />
                  <img
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 z-10"
                    src={FeetK}
                    alt="FeetK Icon"
                  />
                </button>
              ))}
            </div>

            <div className="flex items-center justify-center w-full p-4 space-x-4 ">
              {reviews.map((review, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setCurrentPage(index);
                  }}
                  className={
                    index === currentPage
                      ? "max-w-md w-10 h-4 bg-[#B6D4F0] rounded-full shadow-lg cursor-pointer"
                      : "max-w-md w-4 h-4 bg-[#d7d7d7] rounded-full shadow-lg cursor-pointer"
                  }
                ></div>
              ))}
            </div>
          </div>
        </div>

        <div className=" justify-center w-full flex mt-20 mb-10">
          <div className="items-center text-center justify-center w-1/2 flex max-w-md bg-[#3B82F6] rounded-full shadow-lg p-4">
            <p className="text-3xl text-white p-4">แผนที่</p>
            <img src={FeetBig} alt="logo2" width={60} height={60} />
          </div>
        </div>

        <img src={Map} alt="map" width={800} />
        <div className="items-center w-1/2 text-center  mt-4 bg-[#B6D4F0] rounded-lg shadow-lg p-14">
          <h1 className="text-[#16305C] text-2xl">
            Co-Co Cat Hotel โรงแรมแมว โค-โค่ แค็ท
          </h1>
          <p className="text-[#0A1629] text-lg">
            121, 105 ถนน ทุ่งรี ซอย 3 ตำบล คอหงส์ อำเภอหาดใหญ่ สงขลา 90110
          </p>
        </div>
        <span className="mb-40"></span>
      </div>
    </>
  );
}
