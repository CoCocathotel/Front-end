/* eslint-disable jsx-a11y/alt-text */
import { useEffect, useState, useRef } from "react";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS CSS
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Carousel, Button } from "antd";
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
import { BG1, BG2, Star, DogIcon } from "../../constant/SvgImg";

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
    AOS.init({ duration: 1000 }); // Initialize AOS for animations
    service
      .api("/")
      .then((res) => {
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
        <div className="relative w-full " data-aos="fade-up">
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
                  className="max-h-max object-cover rounded-lg shadow-lg"
                />
              </div>
            ))}
          </Carousel>
        </div>

        {/* Indicator */}
        <div className="flex p-4 space-x-2" data-aos="fade-up">
          {ImgArray.map((_, index) => (
            <div key={index}>
              <div
                onClick={() => {
                  setCurrentIndex(index);
                  carouselRef.current.goTo(index);
                }}
                className={
                  currentIndex === index
                    ? "max-w-md w-10 h-4 bg-[#B6D4F0] rounded-full shadow-lg cursor-pointer"
                    : "max-w-md w-4 h-4 bg-[#d7d7d7] rounded-full shadow-lg cursor-pointer"
                }
              ></div>
            </div>
          ))}
        </div>

        {/* CoCoCat Label */}
        <div
          className="items-center text-2xl flex w-10/12 h-48 mt-4 bg-[#B6D4F0] rounded-full shadow-lg p-4"
          data-aos="fade-up"
        >
          <img src={Logo} alt="logo" width={200} height={120} />
          <p>
            Co-Co Cat Hotel โรงแรมแมว โค-โค่ แค็ท หาดใหญ่ ยินดีต้อนรับ {<br />}
            ต้องเดินทางไกลช่วงไหน…ฝากน้องแมวไว้กับเรา ดูแลน้องแมวห่วงใย
            ปลอดภัยโดยมืออาชีพ
          </p>
        </div>

        {/* Room Label */}
        <Label label="ห้องพักน้องแมว" data-aos="fade-up" />

        {/* Room Details */}
        <div className="relative w-full flex items-center justify-center">
          <div
            className="absolute flex items-end justify-center"
            data-aos="fade-up"
          >
            {room.map((item, index) => (
              <button
                key={index}
                onClick={() => handleActiveIndex(index)}
                className={`relative w-80  transition duration-300 ease-in-out overflow-hidden rounded-lg shadow-lg hover:blur-0 ${
                  effectimg === true
                    ? "blur-sm transition duration-300 ease-in-out scale-75"
                    : ""
                } ${index === 1 ? "scale-100 " : "scale-75 blur-sm "}`}
              >
                <img
                  src={`https://hiykwrlgoinmxgqczucv.supabase.co/storage/v1/object/public/rooms/${item.type}/${item.image[0]}`}
                  alt={item.room_name}
                  className="w-full h-full object-cover rounded-lg transition duration-300 ease-in-out"
                  height={500}
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
          <BG1 />
        </div>

        {/* Review Label */}
        <Label label="รีวิวจากลูกค้า" data-aos="fade-up" />

        {/* Reviews Section */}
        <div className="relative" data-aos="fade-up">
          <Star />

          <button
            onClick={handlePrev}
            disabled={currentPage === 0}
            className={`absolute top-1/3 left-4 p-4 m-5 rounded-full z-30 opacity-80 shadow-md hover:bg-[#16305C] ${
              currentPage === 0 ? "bg-gray-300" : "bg-gray-300"
            } text-white`}
          >
            <ArrowBackIosIcon />
          </button>

          <BG2 />

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages - 1}
            className={`absolute top-1/3 right-4 p-4 m-5 rounded-full z-30 opacity-80 shadow-md hover:bg-[#16305C] ${
              currentPage === totalPages - 1 ? "bg-gray-300" : "bg-gray-300"
            } text-white`}
          >
            <ArrowForwardIosIcon />
          </button>

          <DogIcon />
          <div className="relative grid grid-cols-2 gap-4 bg-[#8FA7BD] p-4 m-20 space-x-4 rounded-lg h-full">
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

            {/* Pagination */}
            <div className="flex items-center justify-center w-full p-4 space-x-4">
              {reviews.map((_, index) => (
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

        {/* Map Section */}
        <div className="justify-center w-full flex mt-20 mb-10">
          <div className="items-center text-center justify-center w-1/2 flex max-w-md bg-[#3B82F6] rounded-full shadow-lg p-4">
            <p className="text-3xl text-white p-4">แผนที่</p>
            <img src={FeetBig} alt="logo2" width={60} height={60} />
          </div>
        </div>

        <img src={Map} alt="map" width={800} />

        <div
          className="items-center w-1/2 text-center mt-4 bg-[#B6D4F0] rounded-lg shadow-lg p-14"
          data-aos="fade-up"
        >
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
