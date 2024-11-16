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
import MenuIcon from "@mui/icons-material/Menu";
import { Drawer } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
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
  const [mobileOpen, setMobileOpen] = useState(false); // For mobile menu

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
  const [visible, setVisible] = useState(true);
  const handleScroll = () => {
    const currentScrollPosition = window.scrollY;

    if (currentScrollPosition > prevScrollPosition) {
      setVisible(false);
    } else {
      setVisible(true);
    }
    setPrevScrollPosition(currentScrollPosition);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPosition]);

  let handle_login = (e) => {
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

  const toggleMobileMenu = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      {/* AppBar Section */}
      <div
        className={`transition-opacity ease-linear duration-700 flex items-center justify-between border-b w-full h-24 top-0 bg-white z-50 sticky ${visible ? "opacity-80" : "opacity-0 invisible"
          }`}
      >
        {/* Logo */}
        <img
          className="hidden md:flex ml-6 sm:ml-10 object-contain cursor-pointer"
          src={Logo}
          alt="logo"
          width={80}
          height={80}
          onClick={() => navigate("/")}
        />

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8 mx-auto">
          <button
            onClick={() => navigate("/")}
            className="text-gray-600 hover:text-blue-500"
          >
            หน้าแรก
          </button>
          <button
            onClick={() => navigate("/booking")}
            className="text-gray-600 hover:text-blue-500"
          >
            จองห้องพัก
          </button>
          <button
            onClick={() => navigate("/rule")}
            className="text-gray-600 hover:text-blue-500"
          >
            ข้อตกลงการเข้าใช้งาน
          </button>
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden mr-4 ml-4">
          <IconButton onClick={toggleMobileMenu} aria-label="menu">
            <MenuIcon />
          </IconButton>
        </div>

        {/* Mobile Menu Drawer */}
        <Drawer
          className="relative"
          anchor="left"
          open={mobileOpen}
          onClose={toggleMobileMenu}
          sx={{
            "& .MuiDrawer-paper": {
              width: "75%",
              backgroundColor: "#f9fafb",
            },
          }}
        >
          <div className="w-full p-4">
            <div className="text-right">
              <IconButton onClick={toggleMobileMenu}>
                <CloseIcon />
              </IconButton>
            </div>

            <img
              className="md:hidden w-full object-contain cursor-pointer items-center justify-center text-center"
              src={Logo}
              alt="logo"
              width={50}
              height={50}
              onClick={() => navigate("/")}
            />

            {/* Login and Register / User Account in Mobile Menu */}
            {!localStorage.getItem("token") ? (
              <div className="flex flex-col space-y-4 mt-4">
                <button
                  onClick={() => {
                    setModal2Open(true);
                    toggleMobileMenu();
                  }}
                  className="w-full text-blue-500 border border-blue-500 rounded-md px-4 py-2 hover:bg-blue-500 hover:text-white transition"
                >
                  สร้างบัญชีผู้ใช้งาน
                </button>
                <button
                  onClick={() => {
                    setModal1Open(true);
                    toggleMobileMenu();
                  }}
                  className="w-full text-blue-500 border border-blue-500 rounded-md px-4 py-2 hover:bg-blue-500 hover:text-white transition"
                >
                  เข้าสู่ระบบ
                </button>
              </div>
            ) : (
              <>
                <React.Fragment>
                  <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
                    <Tooltip title="บัญชีผู้ใช้งาน">
                      <div
                        className="flex items-center space-x-2 cursor-pointer"
                      // onClick={handleClick}
                      >
                        <Avatar sx={{ width: 32, height: 32 }}>
                          {JSON.parse(localStorage.getItem("user-provider")).email[0].toUpperCase()}
                        </Avatar>
                        <p className="text-gray-600">
                          {JSON.parse(localStorage.getItem("user-provider")).first_name}{" "}
                          {JSON.parse(localStorage.getItem("user-provider")).last_name}
                        </p>
                      </div>
                    </Tooltip>
                  </Box>
                </React.Fragment>
                <div className="flex-col flex text-left items-start space-y-4 mt-4">
                  <button
                    onClick={() => {
                      navigate("/account");
                      toggleMobileMenu();
                    }}
                    className=" text-gray-600 hover:text-blue-500"
                  >
                    บัญชีของฉัน
                  </button>
                  <button
                    onClick={() => {
                      navigate("/history");
                      toggleMobileMenu();
                    }}
                    className=" text-gray-600 hover:text-blue-500"
                  >
                    ประวัติการจอง
                  </button>
                  <button
                    onClick={() => {
                      navigate("/Changepassword");
                      toggleMobileMenu();
                    }}
                    className=" text-gray-600 hover:text-blue-500"
                  >
                    เปลี่ยนรหัสผ่าน
                  </button>
                </div>
              </>
            )}

            <h2 className="mt-4 text-lg font-bold">เมนู</h2>
            {/* Navigation Links */}
            <ul className="mt-4 space-y-4">
              <li>
                <button
                  onClick={() => {
                    navigate("/");
                    toggleMobileMenu();
                  }}
                  className="w-full text-left text-gray-600 hover:text-blue-500"
                >
                  หน้าแรก
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    navigate("/booking");
                    toggleMobileMenu();
                  }}
                  className="w-full text-left text-gray-600 hover:text-blue-500"
                >
                  จองห้องพัก
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    navigate("/rule");
                    toggleMobileMenu();
                  }}
                  className="w-full text-left text-gray-600 hover:text-blue-500"
                >
                  ข้อตกลงการเข้าใช้งาน
                </button>
              </li>
            </ul>
          </div>

          {localStorage.getItem("token") && (
            <div className="flex-col flex text-center p-4 absolute bottom-0 w-full bg-red-500 text-white">
              <button
                onClick={handleCloseLogout}
                className=""
              >
                ออกจากระบบ
              </button>
            </div>
          )}
        </Drawer>

        {/* User Account Section for Desktop */}
        <div className="hidden md:flex items-center mr-6">
          {localStorage.getItem("token") ? (
            <React.Fragment>
              <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
                <Tooltip title="บัญชีผู้ใช้งาน">
                  <div
                    className="flex items-center space-x-2 cursor-pointer"
                    onClick={handleClick}
                  >
                    <Avatar sx={{ width: 32, height: 32 }}>
                      {JSON.parse(localStorage.getItem("user-provider")).email[0].toUpperCase()}
                    </Avatar>
                    <p className="text-gray-600">
                      {JSON.parse(localStorage.getItem("user-provider")).first_name}{" "}
                      {JSON.parse(localStorage.getItem("user-provider")).last_name}
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
                <MenuItem
                  onClick={() => {
                    handleClose();
                    navigate("/account");
                  }}
                >
                  บัญชีของฉัน
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleClose();
                    navigate("/history");
                  }}
                >
                  ประวัติการจอง
                </MenuItem>
                <MenuItem onClick={handleCloseLogout}>ออกจากระบบ</MenuItem>
              </Menu>
            </React.Fragment>
          ) : (
            <div className="hidden md:flex space-x-5">
              <button
                onClick={() => setModal2Open(true)}
                className="hover:bg-gray-300 transition ease-linear rounded-md px-4 py-3"
              >
                สร้างบัญชีผู้ใช้งาน
              </button>
              <button
                onClick={() => setModal1Open(true)}
                className="px-4 py-3 border rounded-md bg-white text-blue-500 border-blue-500 hover:text-white hover:bg-blue-500 transition ease-linear"
              >
                เข้าสู่ระบบ
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Login Modal */}
      <Modal
        className="mt-4"
        open={modal1Open}
        onCancel={() => setModal1Open(false)}
        footer={null}
        loading={load2}
      >
        <div className="space-y-4">
          <h1 className="text-3xl">เข้าสู่ระบบ</h1>
          <div className="flex space-x-4">
            <img src={Feet} className="w-5 h-5" alt="feet" />
            <p className="text-sm">ยินดีต้อนรับเข้าสู่โรงแรมโคโค่แคท</p>
          </div>
          <hr />
          <Login handleAppbar={(e) => handle_login(e)} />
        </div>
      </Modal>

      {/* Register Modal */}
      <Modal
        className="mt-4"
        open={modal2Open}
        onCancel={() => setModal2Open(false)}
        footer={null}
        loading={load2}
      >
        <div className="space-y-4">
          <h1 className="text-3xl">ลงทะเบียน</h1>
          <div className="flex space-x-4">
            <img src={Feet} className="w-5 h-5" alt="feet" />
            <p className="text-sm">ยินดีต้อนรับเข้าสู่โรงแรมโคโค่แคท</p>
          </div>
          <hr />
          <Register handleAppbar={(e) => handle_register(e)} />
        </div>
      </Modal>
    </>
  );
}
