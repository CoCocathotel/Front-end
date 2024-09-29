import React from "react";

export default function Card({ card, head, desc, w, flex }) {
  return (
    <div className="relative w-full h-1/3 text-center justify-center items-center mb-10 bg-blue-100 p-5 m-4 shadow-lg rounded-md ">
      {/* <div className="absolute w-full h-44 p-4 bg-gray-300 opacity-50"></div> */}
      <div className={`items-center justify-center   space-x-4  ${flex}`}>
        <div className={`w-auto flex items-center justify-center`} >
          <img src={card} alt="catcard" className={`object-cover z-10 ${w}`} />
        </div>
        <div className="justify-center w-auto items-center text-center space-y-4">
          <h1 className="text-3xl text-[#2757A6] font-semibold">{head}</h1>
          <h2 className="text-center text-xl">{desc}</h2>
        </div>
      </div>
    </div>
  );
}
