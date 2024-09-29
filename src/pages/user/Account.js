import React from "react";
import { Route, Routes, Link, json } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

import Sidebar from "../../component/Sidebar";

export default function Account() {
  return (
    <>
      <div className="bg-gray-200 flex flex-col items-center h-screen p-6">
        <div className="bg-white w-full md:w-1/2 h-auto mt-5 p-6 rounded-lg shadow-lg space-y-4">
          <h1 className="font-semibold text-[#3B82F6] text-2xl">
            ข้อมูลส่วนตัว
          </h1>
          <p className="text-gray-700">
            จัดการข้อมูลส่วนตัวคุณเพื่อความปลอดภัยของบัญชีผู้ใช้นี้
          </p>
          <hr />

          <div className="space-y-4  ">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600 mb-1  w-36">ชื่อ-นามสกุล</label>
              <input
                type="text"
                className="w-96 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="กรอก ชื่อ-นามสกุล"
              
              />
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600 mb-1   w-36">อีเมล</label>
              <input
                type="email"
                className=" w-96 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="กรอก อีเมล"
              />
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600 mb-1  w-36">
                หมายเลขโทรศัพท์
              </label>
              <input
                type="tel"
                className="w-96 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="กรอก หมายเลขโทรศัพท์"
              />
            </div>

            <div className="flex flex-col items-center">
              <button className="w-20 p-2 shadow-md bg-[#3B82F6] text-white rounded-md hover:bg-[#424D57] hover:text-white ">
                บันทึก
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
