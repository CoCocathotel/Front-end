import React from "react";
import FeetBig from "../../src/assets/image/feetBig.png";

export default function Label({ label }) {
  return (
    <div className="flex justify-start w-full mt-20 mb-5">
      <div className="flex items-center w-auto md:w-1/2 lg:w-1/3 bg-[#3B82F6] rounded-r-full shadow-lg p-4 space-x-4">
        <p className="text-xl md:text-2xl text-white">{label}</p>
        <img src={FeetBig} alt="logo2" className="w-10 h-10 md:w-14 md:h-14" />
      </div>
    </div>
  );
}
