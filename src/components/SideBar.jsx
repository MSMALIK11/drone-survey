import { NavLink, Outlet, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "../style/sideBar.css";
import HomeIcon from "@mui/icons-material/Home";
import DatasetIcon from "@mui/icons-material/Dataset";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import LoginInfo from "./Account/LoginInfo";
import api from "../services";
import ConfirmationAlert from "../shared/ConfirmationAlert";
import logo from "../assets/bl.jfif";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Tooltip from "@mui/material/Tooltip";
import { motion } from "framer-motion";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useLocation } from "react-router-dom";
import { getUserdetails } from "../helper/user";
import { stopTokenRefreshInterval } from "../helper/refreshToken";
const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLogoutConfirmAlert, setShowLogoutConfirmAlert] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const [isModalOpen, setModalOpen] = useState(false);

  const handleAvatarClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const menuItem = [
    {
      path: "/",
      name: "Home",
      icon: <HomeIcon style={{ fontSize: "18px" }} />,
    },
    {
      path: "/dataprocessing",
      name: "Data Processing",
      icon: <DatasetIcon style={{ fontSize: "18px" }} />,
    },
  ];
  useEffect(() => {
    const user = getUserdetails();
    if (user) {
      setUser(user);
    }
  }, []);

  const handleLogout = async () => {
    setShowLogoutConfirmAlert(!showLogoutConfirmAlert);
  };
  const handleLogoutConfirm = async () => {
    setIsLoading(true);
    try {
      const response = await api.register.logout();

      if (response.status === 200) {
        setIsLoading(false);
        localStorage.removeItem("auth");
        localStorage.removeItem("auth-user");
        localStorage.removeItem("OtpTitle");
        localStorage.removeItem("refresh_token");
        stopTokenRefreshInterval();
        navigate("/login");
      }
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
      setShowLogoutConfirmAlert(false);
    }
  };

  return (
    <>
      <div className="flex">
        <motion.div
          className="bg-black h-screen sidebar-container relative"
          initial={{ width: "60px" }}
          animate={{ width: isOpen ? "240px" : "60px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="px-3 mb-4 h-[60px] flex items-center">
            {!isOpen ? (
              <img key="logo-image" width={50} src={logo} alt="" />
            ) : (
              <img
                src="https://botlabdynamics.com/sites/default/files/2022-11/BL%20Botlab%20Dynamics%20%281%29.png"
                alt=""
              />
            )}
          </div>
          <div className="relative sidebar-wraper">
            <div
              id="toggle-menu-circle"
              onClick={toggle}
              className="w-[22px]  h-[22px] bg-blue-400 hover:bg-blue-600 rounded-full absolute right-[-10px] !z-50 top-[-10px] flex items-center justify-center text-white"
            >
              {isOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </div>

            {menuItem?.map((item) => {
              return (
                <>
                  <div key={item.name} className="relative">
                    <Tooltip title={item.name} placement="right" arrow>
                      <NavLink
                        to={item.path}
                        className={`link ${
                          pathname === item.path ? "bg-[#6b61616a]" : ""
                        }`}
                        style={{ color: "white", whiteSpace: "nowrap" }}
                      >
                        <div>{item.icon}</div>
                        <div
                          className="link_text"
                          style={{ display: isOpen ? "block" : "none" }}
                        >
                          {item.name}
                        </div>
                      </NavLink>
                    </Tooltip>
                  </div>
                </>
              );
            })}
            <Tooltip title={"User Info"} placement="right" arrow>
              <div className="link">
                <AccountCircleIcon
                  onClick={handleAvatarClick}
                  style={{
                    color: "white",
                    fontSize: "18px",
                    cursor: "pointer",
                  }}
                />
                <p
                  onClick={handleAvatarClick}
                  style={{
                    display: isOpen ? "block" : "none",
                    marginTop: "2px",
                    fontSize: "13px",
                    fontFamily: " sans-serif",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  User Info
                </p>
              </div>
            </Tooltip>
            <div className="flex items-center w-full left-0  absolute bottom-0 h-[60px]  border-t border-gray-500 overflow-hidden  ">
              <div className="px-3 w-full">
                <Tooltip title={"Logout"} placement="right" arrow>
                  <div className="link w-full" onClick={handleLogout}>
                    <ExitToAppIcon style={{ color: "white" }} fontSize="12px" />
                    <p
                      onClick={handleLogout}
                      style={{
                        display: isOpen ? "block" : "none",
                        fontSize: "13px",
                        fontFamily: " sans-serif",
                        cursor: "pointer",
                      }}
                    >
                      Logout
                    </p>
                  </div>
                </Tooltip>
              </div>
            </div>
          </div>

          <LoginInfo
            user={user}
            open={isModalOpen}
            onClose={handleCloseModal}
          />
        </motion.div>
        <main>
          <Outlet />
        </main>
      </div>

      <ConfirmationAlert
        width={"460px"}
        isLoading={isLoading}
        message={"Are you sure you want to logout?"}
        open={showLogoutConfirmAlert}
        onConfirm={handleLogoutConfirm}
        onClose={() => setShowLogoutConfirmAlert(!showLogoutConfirmAlert)}
      />
    </>
  );
};

export default SideBar;
