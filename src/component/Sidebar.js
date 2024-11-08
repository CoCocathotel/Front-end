import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import RestoreIcon from '@mui/icons-material/Restore';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

export default function Sidebar({ value }) {
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
       setActiveIndex(value);
    }, [value]);

    return (
        <div className="fixed p-12 hidden md:block"> {/* Sidebar hidden on mobile, visible on md and up */}
            <React.Fragment>
                <div className="flex items-center space-x-2 text-xl">
                    <Avatar sx={{ width: 44, height: 44 }}>
                        {JSON.parse(
                            localStorage.getItem("user-provider")
                        ).email[0].toUpperCase()}
                    </Avatar>
                    <div>
                        <p>
                            {JSON.parse(localStorage.getItem("user-provider")).first_name}{" "}
                            {JSON.parse(localStorage.getItem("user-provider")).last_name}
                        </p>
                        <p className="text-sm">แก้ไขข้อมูลส่วนตัว</p>
                    </div>
                </div>
            </React.Fragment>

            <div className="mt-20 text-sm">
                <ul className="space-y-4">
                    <li>
                        <button
                            onClick={() => { setActiveIndex(0); navigate("/account"); }}
                            className={`flex space-x-4 items-center ${activeIndex === 0 ? "text-cyan-400" : ""}`}
                        >
                            <PersonOutlineIcon /> <p>บัญชีของฉัน</p>
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => { setActiveIndex(1); navigate("/history"); }}
                            className={`flex space-x-4 items-center ${activeIndex === 1 ? "text-cyan-400" : ""}`}
                        >
                            <RestoreIcon /> <p>ประวัติการจอง</p>
                        </button>
                    </li>
                    <li>
                    <button
                          onClick={() => {setActiveIndex(2); navigate("/Changepassword");}}
                          className={`flex space-x-4 items-center ${activeIndex === 2 ? "text-cyan-400" : ""}`}
                        >
                          <VpnKeyIcon /> <p>เปลี่ยนรหัสผ่าน</p>
                    </button>
                    </li>
                </ul>
            </div>
        </div>
    );
}