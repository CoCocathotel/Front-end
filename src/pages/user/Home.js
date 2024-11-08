/* eslint-disable jsx-a11y/alt-text */
import { useEffect, useState, useRef, act } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Carousel } from "antd";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../component/Loading";
import Label from "../../component/Label";
import Logo from "../../cococat-hotel.png";
import FeetBig from "../../assets/image/feetBig.png";
import Bg from "../../assets/image/bg.png";
import FeetBlue from "../../assets/image/feet_blue.png";
import FeetK from "../../assets/image/feet_kuay.png";
import { BG1, BG2, Star, DogIcon } from "../../constant/SvgImg";
import api from "../../utils/api";

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
  const [data, setData] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [indexReview, setIndextReview] = useState(0);

  const itemsPerPage = 9;
  const totalPages = Math.ceil(reviews.flat().length / itemsPerPage);

  const currentReviews = reviews
    .flat()
    .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  let tempReview = 0;
  const handleNext = (mode) => {
    if (!mode) {
      if (currentPage < totalPages - 1) {
        setCurrentPage(currentPage + 1);
      }
    } else {
      if (indexReview < allReviews.length - 1) {
        setIndextReview(indexReview + 1);
      }
    }
  };

  const handlePrev = (mode) => {
    if (!mode) {
      if (currentPage > 0) {
        setCurrentPage(currentPage - 1);
      }
    } else {
      if (indexReview > 0) {
        setIndextReview(indexReview - 1);
      }
    }
  };

  useEffect(() => {
    AOS.init({ duration: 1000 });

    api.getRoom().then((res) => {
      setRoom(res.data.body);
    }).catch((err) => {
      setError(err.message);
    }).finally(() => {
    });
    api.getHome().then((res) => {
      var data = res.data.body[0];
      setData(data);
      setImgArray(data.heroImage.map((item) => item));
      let temp = [];

      setReviews(data.reviewImage.map((item, index) => {
        if (index % 3 === 0) {
          temp.push(item);
        }
        return temp;
      }));
      setAllReviews(data.reviewImage);

    }).catch((err) => {
      setError(err.message);
    })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleCarouselChange = (current) => {
    setCurrentIndex(current);
  };

  const handleRoomCarouselChange = (direction) => {
    if (direction === 'next' && activeIndex < room.length - 1) {
      setActiveIndex(activeIndex + 1);
    } else if (direction === 'prev' && activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
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


  if (loading && reviews) return <LoadingSpinner />;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  //UI part
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
        <div className="relative w-full" data-aos="fade-up">
          {/* Responsive Carousel for desktop and horizontal scroll for mobile */}
          <div className="hidden md:block">
            <Carousel
              autoplay
              ref={carouselRef}
              arrows
              infinite={false}
              beforeChange={(from, to) => handleCarouselChange(to)}
            >
              {ImgArray.map((image, index) => (
                <div key={index} className="relative w-full h-[500px] flex justify-center">
                  <img
                    src={`${image}`}
                    alt={`image-${index}`}
                    className="w-full h-[500px] object-cover object-center rounded-lg shadow-lg"
                  />
                </div>
              ))}
            </Carousel>
          </div>

          {/* Horizontal Scroll for Mobile */}
          <div className="md:hidden">
            <Carousel
              autoplay
              ref={carouselRef}
              arrows
              infinite={false}
              beforeChange={(from, to) => handleCarouselChange(to)}
            >
              {ImgArray.map((image, index) => (
                <div key={index} className="relative w-full h-auto flex justify-center">
                  <img
                    src={`${image}`}
                    alt={`image-${index}`}
                    className="w-full h-auto object-contain object-center rounded-lg shadow-lg"
                  />
                </div>
              ))}
            </Carousel>
          </div>
        </div>

        {/* Indicator */}
        <div className="hidden md:flex p-4 space-x-2" data-aos="fade-up">
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
          className="flex items-center justify-between w-11/12 md:w-10/12 h-auto mt-4 bg-[#B6D4F0] rounded-full shadow-lg p-3 md:p-4 space-x-2"
          data-aos="fade-up"
        >
          <img src={Logo} alt="logo" className="w-20 md:w-36 h-auto mr-2 flex-shrink-0" />
          <p className="flex-1 text-center text-sm sm:text-base md:text-2xl leading-snug sm:leading-relaxed md:leading-normal">
            {data.title}
          </p>
        </div>

        {/* Room Label */}
        <Label label="ห้องพักน้องแมว" className="mt-8" data-aos="fade-up" />

        {/* Room Details */}
        <div className="hidden md:flex relative w-full  items-center justify-center">
          <div
            className="absolute flex items-end justify-center"
            data-aos="fade-up"
          >
            {room.map((item, index) => (
              <button
                key={item._id}
                onClick={() => handleActiveIndex(index)}
                className={`relative w-80  transition duration-300 ease-in-out overflow-hidden rounded-lg shadow-lg hover:blur-0 ${effectimg === true
                  ? "blur-sm transition duration-300 ease-in-out scale-75"
                  : ""
                  } ${index === 1 ? "scale-100 " : "scale-75 blur-sm "}`}
              >
                <img
                  src={item.image[0]}
                  alt={item.room_name}
                  className="w-full h-full aspect-[3/6]	 object-cover rounded-lg transition duration-300 ease-in-out"
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

        {/* Room Details */}
        <div className="relative flex md:hidden w-full items-center justify-center">
          {/* Mobile Version - Horizontal Scroll */}
          <div className=" md:hidden w-full flex justify-center">
            <div className="relative w-full flex items-center justify-center mx-auto px-4"> {/* Added padding for consistent spacing */}
              {/* Wrapper for the entire card and navigation arrows */}
              <div className="relative flex items-center justify-center w-96 max-w-sm mx-auto">

                <button
                  onClick={() => {handleRoomCarouselChange('prev')}}
                  disabled={activeIndex === 0}
                  className={`absolute top-1/2 left-0 p-4 ml-1 rounded-full z-30 opacity-80 shadow-md hover:bg-[#16305C] ${currentPage === 0 ? "bg-gray-300" : "bg-gray-300"
                    } text-white`}
                >
                  <ArrowBackIosIcon />
                </button>

                <div className="w-full flex justify-center items-center">
                  <div
                    className={`relative w-full transition duration-300 ease-in-out overflow-hidden rounded-lg shadow-lg ${effectimg
                      ? "blur-sm transition duration-300 ease-in-out scale-75"
                      : ""
                      } mx-auto`}
                  >
                    <img
                      src={room[activeIndex]?.image[0]}
                      alt={room[activeIndex]?.room_name}
                      className="w-full object-cover aspect-[3/6]	 rounded-lg transition duration-300 ease-in-out mx-auto"
                    />

                    <div className="absolute bottom-0 w-full bg-[rgba(22, 48, 131, 0.8)] backdrop-blur-sm p-2 sm:p-4 flex items-center justify-between">
                      <div className="w-40 sm:w-48">
                        <h1 className="text-white font-semibold text-sm sm:text-base">{room[activeIndex]?.room_name}</h1>
                        <p className="text-white text-xs sm:text-sm">
                          รองรับน้องแมวได้ {room[activeIndex]?.number_of_cats} ตัว
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          navigate("/booking");
                        }}
                        className="bg-[#224683] hover:bg-[#202d42] text-white w-24 sm:w-28 h-8 sm:h-10 rounded-full px-2 py-1 flex items-center"
                      >
                        <h1 className="mr-1 text-xs sm:text-sm">ดูเพิ่มเติม</h1>
                        <img src={FeetBlue} alt="rom2" className="w-5 sm:w-6 h-5 sm:h-6" />
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => { handleRoomCarouselChange('next')}}
                  disabled={activeIndex === room.length - 1}
                  className={`absolute top-1/2 right-0 p-4 mr-1 rounded-full z-30 opacity-80 shadow-md hover:bg-[#16305C] ${currentPage === totalPages - 1 ? "bg-gray-300" : "bg-gray-300"
                    } text-white`}
                >
                  <ArrowForwardIosIcon />
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Version - Original */}
          <div className="hidden md:flex absolute w-full  items-center justify-center mx-auto px-4" data-aos="fade-up"> {/* Added padding for consistent spacing */}
            {/* Wrapper for centering cards */}
            <div className="flex items-end justify-center flex-wrap gap-4 w-full mx-auto">
              {room.map((item, index) => (
                <button
                  key={item._id}
                  onClick={() => handleRoomCarouselChange('next')}
                  className={`relative w-72 transition duration-300 ease-in-out overflow-hidden rounded-lg shadow-lg hover:blur-0 ${effectimg
                    ? "blur-sm transition duration-300 ease-in-out scale-75"
                    : ""
                    } ${index === 1 ? "scale-100" : "scale-75 blur-sm"} mx-auto`}
                >
                  <img
                    src={item.image[0]}
                    alt={item.room_name}
                    className="w-full h-[500px] object-cover rounded-lg transition duration-300 ease-in-out mx-auto"
                    style={{ objectFit: 'cover', aspectRatio: '3 / 4' }}
                  />

                  {index === 1 && (
                    <div className="absolute bottom-0 w-full bg-[rgba(22, 48, 131, 0.8)] backdrop-blur-sm p-4 flex items-center justify-between">
                      <div className="w-48">
                        <h1 className="text-white font-bold">{item.room_name}</h1>
                        <p className="text-white text-sm">
                          รองรับน้องแมวได้ {item.number_of_cats} ตัว
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          navigate("/booking");
                        }}
                        className="bg-[#224683] hover:bg-[#202d42] text-white w-28 md:w-32 h-10 rounded-full px-2 py-1 flex items-center"
                      >
                        <h1 className="mr-2">ดูเพิ่มเติม</h1>
                        <img src={FeetBlue} alt="rom2" className="w-6 h-6" />
                      </button>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
          <BG1 />
        </div>

        {/* Review Label */}
        <Label label="รีวิวจากลูกค้า" className="mt-8" data-aos="fade-up" />
        {/* Reviews Section Desktop*/}
        <div className="relative hidden md:flex" data-aos="fade-up">
          <Star />
          <button
            onClick={() => { handlePrev(false) }}
            disabled={currentPage === 0}
            className={`absolute top-1/3 left-4 p-4 m-5 rounded-full z-30 opacity-80 shadow-md hover:bg-[#16305C] ${currentPage === 0 ? "bg-gray-300" : "bg-gray-300"
              } text-white`}
          >
            <ArrowBackIosIcon />
          </button>

          <BG2 />

          <button
            onClick={() => { handleNext(false) }}
            disabled={currentPage === totalPages - 1}
            className={`absolute top-1/3 right-4 p-4 m-5 rounded-full z-30 opacity-80 shadow-md hover:bg-[#16305C] ${currentPage === totalPages - 1 ? "bg-gray-300" : "bg-gray-300"
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
              {reviews
                .filter((_, index) => (index + 1) % 3 === 0)
                .map((_, index) => (
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
                  >
                  </div>
                ))}
            </div>

          </div>
        </div>


        {/* Reviews Section Mobbile*/}

        <div className="relative md:hidden p-3" data-aos="fade-up">
          <button
            onClick={() => { handlePrev(true) }}
            // disabled={currentPage === 0}
            className={`absolute top-1/3 left-0 p-4 m-5 rounded-full z-30 opacity-80 shadow-md hover:bg-[#16305C] ${currentPage === 0 ? "bg-gray-300" : "bg-gray-300"
              } text-white`}
          >
            <ArrowBackIosIcon />
          </button>
          <BG2 />
          <button
            onClick={() => { handleNext(true) }}
            // disabled={currentPage === totalPages - 1}
            className={`absolute top-1/3 right-0 p-4 m-5 rounded-full z-30 opacity-80 shadow-md hover:bg-[#16305C] ${currentPage === totalPages - 1 ? "bg-gray-300" : "bg-gray-300"
              } text-white`}
          >
            <ArrowForwardIosIcon />
          </button>

          <div className="relative bg-[#8FA7BD] p-4  space-x-4 rounded-lg h-full">
            <div className="h-1/2 z-10">
              <img src={allReviews[indexReview]} alt="Main Review" />
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="w-full flex flex-col items-center mt-12 md:mt-20 mb-8 md:mb-10 space-y-6" data-aos="fade-up">
          {/* Title and Icon */}
          <div className="flex items-center justify-center bg-[#3B82F6] text-white text-center rounded-full shadow-lg p-3 md:p-6">
            <p className="text-lg md:text-2xl font-bold">แผนที่</p>
            <img src={FeetBig} alt="Map Icon" className="ml-2 md:ml-4 w-10 md:w-16 h-auto" />
          </div>

          {/* Map Image */}
          <div className="w-10/12 sm:w-9/12 md:w-3/4 lg:w-1/2 my-2">
            <img src={data.mapImage} alt="Map" className="w-full h-auto rounded-lg shadow-md" />
          </div>

          {/* Map Detail Text Box */}
          <div className="bg-[#B6D4F0] text-center rounded-lg shadow-lg p-3 sm:p-5 md:p-10 w-10/12 sm:w-9/12 md:w-3/4 lg:w-1/2 my-3">
            <h1 className="text-[#16305C] text-sm sm:text-lg md:text-2xl font-bold leading-snug">
              Co-Co Cat Hotel โรงแรมแมว โค-โค่ แค็ท
            </h1>
            <p className="text-[#0A1629] text-xs sm:text-sm md:text-lg leading-relaxed mt-1">
              {data.mapDetail}
            </p>
          </div>
        </div>

        <span className="mb-40"></span>
      </div>
    </>
  );
}
