import React from "react";
import logoSm from "../assets/logosm.png";
import dronShadowImg from "../assets/dronShadow.svg";
import { Button } from "@mui/material";
import { motion } from "framer-motion";
import ellipsImg from "../assets/Ellipse.svg";
import { NavLink } from "react-router-dom";
const LandingPage = () => {
  return (
    <div className="grid grid-cols-2   h-screen">
      <div className="bg-[#F5F6FF] max-h-full relative  ">
        <img src={logoSm} className="ms-10 my-4" alt="Botlab logo" />
        <div>
          <div className="ms-52">
            <h1 className="text-3xl">Get Started Now</h1>
            <h1 className="mt-2">Be a part of the Drone Survey revolution.</h1>
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
            <div className="flex flex-col mt-[-30px] gap-4">
              <NavLink to={"/login"}>
                <Button
                  sx={{
                    borderRadius: "25px",
                    width: "425px",
                    background: "white",
                  }}
                  variant="outlined"
                >
                  Login
                </Button>
              </NavLink>
              <NavLink to={"/newSignUp"}>
                <Button
                  sx={{
                    borderRadius: "25px",
                    width: "425px",
                    background: "white",
                  }}
                  variant="outlined"
                >
                  Sign up
                </Button>
              </NavLink>
              <Button
                sx={{ borderRadius: "25px", width: "425px" }}
                variant="contained"
              >
                contact us
              </Button>
            </div>
          </div>
        </div>

        <img
          src={ellipsImg}
          className="absolute bottom-0 left-[15%]"
          alt="circle design"
        />
      </div>
      {/*Right side */}
      <div className="relative right-side">
        <div className="absolute left-[16px] top-[35%] w-[38%]">
          <h1 className="text-3xl">
            Start Your Awesome Drone Survey Project With Us
          </h1>
          <p className="mt-4">Be a part of the Drone survey revolution.</p>
        </div>
        {/* <img src={dronAnimation} width={400} /> */}
      </div>
    </div>
  );
};

export default LandingPage;
