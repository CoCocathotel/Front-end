import React from "react";

export default function Footer() {
  return (
    <footer className=" bg-[#55605B] p-14  items-center justify-between text-center shadow-lg w-full">
      <h1 className="text-3xl text-left text-white">ติดต่อเรา</h1>
      <div className="flex  text-white justify-between   mt-2 mb-10">
        <div className=" text-left">
          <div>
            <p className="text-white">Adress</p>
            <p className="text-white">
              121, 105 3 Ban Tungree, Kho Hong, Hat Yai District, Songkhla 90110
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
      <h1 className="text-left text-white p-5">© 2023 All rights Reserved.</h1>
    </footer>
  );
}
