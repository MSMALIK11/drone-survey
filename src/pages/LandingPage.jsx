import React from "react";
import logoSm from "../assets/logosm.png";
import dronShadowImg from "../assets/dronShadow.svg";
import { Button } from "@mui/material";
import { motion } from "framer-motion";
import ellipsImg from "../assets/Ellipse.svg";
import circleImage from "../assets/circle.svg";
import dronRight from "../assets/dron1.png";
import dronShadow from "../assets/spread.svg";
import { NavLink } from "react-router-dom";
import dronAnimation from '../assets/dronanimation.gif'
const LandingPage = () => {
  return (
    <div className="grid grid-cols-2   h-screen">
      <div className="bg-[#F5F6FF] max-h-full relative  ">
        <img src={logoSm} className="ms-10 my-4" />
        <div>
          <div className="ms-52">
            <h1 className="text-3xl">Get Started Now</h1>
            <h1 className="mt-2">Be a part of the Drone Survey REVOLUTION.</h1>
          </div>
          <div className="flex mt-4 justify-center items-center flex-col">
            <motion.img
              src={dronShadowImg}
              width={600}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              alt="Drone Shadow"
            />
            <div className="flex flex-col mt-6 gap-4">
              <Button
                sx={{ borderRadius: "25px", width: "425px" }}
                variant="outlined"
              >
                <NavLink to={"/login"}>Login</NavLink>
              </Button>
              <Button
                sx={{ borderRadius: "25px", width: "425px" }}
                variant="outlined"
              >
                <NavLink to={"/newSignUp"}>Sign up</NavLink>
              </Button>
              <Button
                sx={{ borderRadius: "25px", width: "425px" }}
                variant="contained"
              >
                contact us
              </Button>
            </div>
          </div>
        </div>

        <img src={ellipsImg} className="absolute bottom-0 left-[15%]" />
      </div>

      <div className="relative">
        <img src={circleImage} width={200} className="ms-10 mt-6" />
        <div className="absolute right-10 top-[50px]">
          <motion.img
            src={dronRight}
            className="w-[760px]"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          />
          <motion.img
            src={dronShadow}
            alt=""
            className="absolute left-[160px] top-[265px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, filter: "brightness(1.t)" }}
            transition={{ duration: 1, delay: 1 }}
          />
        </div>

        <div className="absolute left-[16px] top-[35%] w-[40%]">
          <h1 className="text-3xl">
            Start Your Awesome Drone Survey Project With Us
          </h1>
          <p className="mt-4">Be a part of the Drone survey REVOLUTION.</p>
        </div>
      {/* <img src={dronAnimation} width={400} /> */}
      </div>
    </div>
  );
};

export default LandingPage;
