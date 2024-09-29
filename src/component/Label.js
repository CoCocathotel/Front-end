
import React from "react";
import FeetBig from "../../src/assets/image/feetBig.png";

export default function Label({label}) {
  return (
    <div className=" justify-start w-full items-start flex mt-20 mb-10">
      <div className="justify-end items-center w-1/3 flex  bg-[#3B82F6] rounded-r-full shadow-lg p-4">
        <p className="text-2xl text-white p-4">{label}</p>
        <img src={FeetBig} alt="logo2" width={60} height={60} />
      </div>
    </div>
  );
}
