import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Logo from "../../src/cococat-hotel.png";
import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import { Modal } from "antd";
import Feet from "../../src/assets/image/feet.png";

export default function Appbar_master() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [modal1Open, setModal1Open] = useState(false);
  const [modal2Open, setModal2Open] = useState(false);
  const [load2, SetLoad2] = useState(false);

  const handleCloseLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user-provider");
    navigate('/');
    window.location.reload();
    setAnchorEl(null);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const [prevScrollPosition, setPrevScrollPosition] = useState(0);
  const [visible, setVisable] = useState(true);
  const handleScroll = () => {
    const currentScrollPosition = window.scrollY;

    if (currentScrollPosition > prevScrollPosition) {
      setVisable(false);
    } else {
      setVisable(true);
    }
    setPrevScrollPosition(currentScrollPosition);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  let handle_login = (e) => {
    console.log(e);
    setModal1Open(e);
    if (e) {
      SetLoad2(e);
      setTimeout(() => {
        SetLoad2(!e);
      }, 1000);
    } else {
      SetLoad2(e);
    }
  };

  let handle_register = (e) => {
    console.log(e);
    setModal2Open(e);
    if (e) {
      SetLoad2(e);
      setTimeout(() => {
        SetLoad2(!e);
      }, 1000);
    } else {
      SetLoad2(e);
    }
  };

  return (
    <>
      <div
        className={`transition ease-linear duration-700 flex border-b w-full h-24 top-0 bg-white z-50 sticky  ${
          visible ? "opacity-80" : "opacity-0 invisible"
        }`}
      >
        {localStorage.getItem("token") &&
        JSON.parse(localStorage.getItem("user-provider")).pos === "admin" ? (
          <>
            <div className="grid grid-cols-6 w-full gap-1 p-2">
              <img
                className="ml-24"
                src={Logo}
                alt="logo"
                width={80}
                height={80}
              />
              {/* 
              <div
                className="text-gray-600 hover:text-blue-500"
              >
                การจองทั้งหมด
              </div> */}

              {/* <button
                onClick={() => {
                  navigate("/admin_home");
                }}
                className="text-gray-600 hover:text-blue-500"
              >
                การจองทั้งหมด
              </button>
              <button
                onClick={() => {
                  navigate("/ad_analytic");
                }}
                className="text-gray-600 hover:text-blue-500"
              >
                ข้อมูลเชิงวิเคราะห์
              </button>
              <button
                onClick={() => {
                  navigate("#");
                }}
                className="text-gray-600 hover:text-blue-500"
              >
                จัดการหน้า
              </button>
              <button
                onClick={() => {
                  navigate("#");
                }}
                className="text-gray-600 hover:text-blue-500"
              >
                จัดการผู้ใช้งาน
              </button> */}
            </div>
          </>
        ) : (
          <>
            <div className="flex w-full">
              <img
                className="ml-24 object-contain"
                src={Logo}
                alt="logo"
                width={80}
                height={80}
              />
             <div className="flex justify-between w-96">
              <span></span>
             <button
                onClick={() => {
                  navigate('/')
                }}
                className="text-gray-600 hover:text-blue-500"
              >
                หน้าแรก
              </button>
              <button
                onClick={() => {
                  navigate("/booking");
                }}
                className="text-gray-600 hover:text-blue-500"
              >
                จองห้องพัก
              </button>
              <button
                onClick={() => {
                  navigate("/rule");
                }}
                className="text-gray-600 hover:text-blue-500"
              >
                ข้อตกลงการเข้าใช้งาน
              </button>
             </div>
            </div>
          </>
        )}
        
        {localStorage.getItem("token") ? (
          <>
            <React.Fragment>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <Tooltip title="บัญชีผู้ใช้งาน">
                  <div
                    className="flex w-44 space-x-2 mr-24 items-center justify-start text-start"
                    onClick={handleClick}
                  >
                    <IconButton
                      size="small"
                      sx={{ ml: 2 }}
                      aria-controls={open ? "account-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? "true" : undefined}
                    >
                      <Avatar sx={{ width: 32, height: 32 }}>
                        {JSON.parse(
                          localStorage.getItem("user-provider")
                        ).email[0].toUpperCase()}
                      </Avatar>
                    </IconButton>
                    <p>
                      {" "}
                      {
                        JSON.parse(localStorage.getItem("user-provider"))
                          .first_name
                      }{" "}
                      {
                        JSON.parse(localStorage.getItem("user-provider"))
                          .last_name
                      }
                    </p>
                  </div>
                </Tooltip>
              </Box>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&::before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem onClick={(_)=>{handleClose(); navigate("/account")}}>บัญชีของฉัน</MenuItem>

                <MenuItem onClick={(_)=>{handleClose(); navigate("/history")}}>ประวัติการจอง</MenuItem>

                <MenuItem onClick={handleCloseLogout}>ออกจากระบบ</MenuItem>
              </Menu>
            </React.Fragment>
          </>
        ) : (
          <>
            <div className="flex space-x-5 w-96 mr-24  items-center justify-center text-start">
              <button
                onClick={(_) => {
                  setModal2Open(true);
                }}
                className=" hover:bg-gray-300 transition ease-linear   rounded-md px-4 py-3"
              >
                สร้างบัญชีผู้ใช้งาน
              </button>

              <button
                onClick={(_) => {
                  setModal1Open(true);
                }}
                className="px-4 py-3 border rounded-md bg-whie text-blue-500 border-blue-500 hover:text-white hover:bg-blue-500 transition ease-linear "
              >
                เข้าสู่ระบบ
              </button>
            </div>
          </>
        )}
      </div>

      <Modal
        style={{ top: 20 }}
        open={modal1Open}
        onCancel={() => setModal1Open(false)}
        footer={null}
        loading={load2}
      >
        <div className="space-y-4">
          <h1 className="text-3xl">เข้าสู่ระบบ</h1>
          <div className="flex space-x-4">
            <img src={Feet} className="w-5  h-5" alt="feet" />
            <p className="text-xm ">ยินดีต้อนรับเข้าสู่โรงแรมโคโค่แคท</p>
          </div>
          <hr />

          <Login handleAppbar={(e) => handle_login(e)} />
        </div>
      </Modal>
      <Modal
        style={{ top: 20 }}
        open={modal2Open}
        onCancel={() => setModal2Open(false)}
        footer={null}
        loading={load2}
      >
        <div className="space-y-4">
          <h1 className="text-3xl">ลงทะเบียน</h1>
          <div className="flex space-x-4">
            <img src={Feet} className="w-5  h-5" alt="feet" />
            <p className="text-xm ">ยินดีต้อนรับเข้าสู่โรงแรมโคโค่แคท</p>
          </div>
          <hr />
          <Register handleAppbar={(e) => handle_register(e)} />
        </div>
      </Modal>
    </>
  );
}
