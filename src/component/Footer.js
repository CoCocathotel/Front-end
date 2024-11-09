import React from "react";
import { useState, useEffect } from "react";
import api from "../utils/api";
import { FeetTop, FeetBottom } from "../constant/SvgImg";

export default function Footer() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    api.getFooter()
      .then(res => {
        setData(res?.data?.body[0] || []);
      //  console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        // setLoading(false);
      });
  };

  return (
    <footer className="bg-[#F0F8FF]  text-[#3B82F6] flex p-4 w-full relative shadow-[rgba(0,0,15,0.1)_10px_-14px_14px_-2px]">
      <div className="p-4 justify-start items-start text-start flex">
        {FeetTop}
      </div>
      <div className="w-full">
        <h1 className="text-3xl text-left text-[#3B82F6] ">{data.headFooter || "Co-Co Cat Hotel โรงแรมแมว โค-โค่ แค็ท "}</h1>
        <div className="flex text-[#3B82F6]  justify-between mt-2 mb-10">
          <div className=" text-left text-[#3B82F6]">
            <div className="grid grid-cols-1 gap-4 ">
              <p className="text-[#3B82F6]">
                {data.addressFooter || "121, 105 3 Ban Tungree, Kho Hong, Hat Yai District, Songkhla 90110"}

              </p>
              <p className="text-[#3B82F6]">โทร : {data.phoneFooter || "065-384-5659"}</p>
            </div>
          </div>
          <div className=" text-[#3B82F6] text-left  items-end justify-end">
            <p>Line : {data.lineFooter || "https://lin.ee/8OFTOx2l(@cococathotel)IG"}</p>
            <p>Tiktok : {data.tiktokFooter || "cococat.hotelTiktok: cococat.hotel"} </p>
          </div>
        </div>
        <div className="border-b-4 border-[#3B82F6]"></div>
        <h1 className="text-left text-[#3B82F6] p-5">
          © 2024 All rights Reserved.
        </h1>
      </div>
      <div className="p-4 justify-end items-end text-end flex">
        {FeetBottom}
      </div>
    </footer>
  );
}
