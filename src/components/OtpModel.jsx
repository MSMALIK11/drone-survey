import React, { useState, useEffect } from "react";
import OTPInput from "react-otp-input";
import Logo from "../Images/logo2.png";
import "../style/otp.css";
import Cookie from "js-cookie";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, Button } from "@mui/material";
import api from "../services";
import { errorHandler } from "../helper/handleError";
import useToast from "../hooks/useToast";
import Loading from "../shared/Loading";
import { useTranslation } from "react-i18next";
const OtpModel = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const [time, setTime] = useState(60);
  const [OtpTitle, setOtpTitle] = useState("");
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  useEffect(() => {
    // Retrieve data from localStorage when the component mounts
    const retrievedData = localStorage.getItem("OtpTitle");
    if (retrievedData) {
      setOtpTitle(retrievedData);
    }
  }, []);

  useEffect(() => {
    if (time > 0) {
      const timer = setTimeout(() => setTime(time - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [time]);

  const handleOtpChange = (otp) => {
    const numericValue = otp.replace(/\D/g, "");
    setOtp(numericValue);
  };

  const forgetPassword = async () => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    if (auth?.email) {
      const payload = {
        email: auth.email,
        otp,
      };
      const res = await api.register.otpVerification(payload);
      if (res.status === 200) {
        const token = res?.data?.refresh_token?.refresh_token;
        Cookie.set("refresh_token", token);
        localStorage.setItem("refreshStartTime", new Date().getTime());
        setLoading(false);
        toast("Logged in successfully.", "success");
        localStorage.removeItem("auth");
        navigate("/");
      }
    }
  };
  const resetpassword = async () => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    const payload = {
      email: auth.email,
      new_password: auth.password,
      otp: otp,
    };
    try {
      const res = await api.register.resetPassword(payload);
      if (res.status === 201) {
        const message = res?.data?.message || "Password updated successfully";
        toast(message, "success");
        navigate("/login");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error::While caling reset password api", error);
      setLoading(false);
    }
  };

  // Send otp vericatin
  const login = async () => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    try {
      const payload = {
        email: auth.email,
        password: auth.password,
      };
      const res = await api.register.login(payload);
      if (res.status === 201) {
        setLoading(false);
        const message = res?.data?.message || "Enter otp recieved on mail.";
        toast(message, "success");
      }
    } catch (error) {
      setLoading(false);
    }
  };
  const loginOtpVerifycation = async () => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    const payload = {
      email: auth.email,
      otp: otp,
    };

    try {
      const res = await api.register.otpVerification(payload);
      if (res.status === 200) {
        const token = res?.data?.refresh_token?.refresh_token;
        localStorage.setItem("refresh_token", token);

        setLoading(false);
        toast("Logged in successfully.", "success");
        localStorage.removeItem("auth");
        window.location.href = "/";
        setLoading(false);
      }
    } catch (error) {
      console.error("Error::while calling login otp verification api", error);
      const errorMessage = errorHandler(error);
      setLoading(false);
      toast(errorMessage, "error");
    }
  };
  const handleVerify = async () => {
    setLoading(true);
    try {
      if (OtpTitle === "Forget") {
        forgetPassword();
      } else if (OtpTitle === "Login") {
        loginOtpVerifycation();
      } else {
        resetpassword();
      }
    } catch (error) {
      console.error(error);
      if (error.response.status === 400 && error?.response?.data) {
        toast("Please enter a valid OTP.", "error");
        setOtp("");
        setLoading(false);
        return;
      }
      const errorMessage = errorHandler(error);
      toast(errorMessage, "error");
      setLoading(false);
    }
  };

  const handleResend = async () => {
    const authData = JSON.parse(localStorage.getItem("auth"));
    setLoading(true);
    setOtp("");
    try {
      if (OtpTitle === "Forget") {
        const res = await api.register.login(authData);
        if (res.status === 201) {
          setLoading(false);
          setTime(60);
        }
      } else if (OtpTitle === "Login") {
        login();
      } else {
        const payload = {
          user_email: authData.email,
        };
        const res = await api.register.sendResetPasswordOTPEmail(payload);
        if (res.status === 201) {
          toast(t("messages.OTPSentSuccess"), "success");
        }
        setLoading(false);
      }
    } catch (error) {
      const errorMessage = errorHandler(error);
      toast(errorMessage, "error");
      setLoading(false);
    }
  };
  let isDisabled = otp?.length !== 6;
  return (
    <div className="forgot-password-container">
      <Loading isVisible={loading} />
      <div className="forgot-password-main">
        <img
          src={Logo}
          alt="Logo"
          style={{ marginBottom: "30px", width: "80%" }}
        />
        <h1 style={{ marginLeft: "-317px" }}>{OtpTitle}</h1>
        <p className="text-muted mb-8">
          Please enter the OTP sent to your registered email ID.
        </p>
        <OTPInput
          value={otp}
          onChange={handleOtpChange}
          numInputs={6}
          separator={<span>-</span>}
          inputStyle="otp-input"
          renderInput={(props) => <input {...props} />}
        />
        <Box mt={4}>
          <Button
            variant="contained"
            fullWidth
            className="loginBtn"
            onClick={handleVerify}
            disabled={isDisabled || loading}
          >
            {loading ? (
              <CircularProgress size={"1.3rem"} style={{ color: "white" }} />
            ) : (
              "Login"
            )}
          </Button>
        </Box>

        <div className="flex justify-between mt-2 px-3">
          <p style={{ fontSize: "12px" }}>Remaining time: 00:{time}s</p>
          <p onClick={handleResend} style={{ fontSize: "12px" }}>
            Don't get the code? <span className={`resend-link`}>Resend</span>{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OtpModel;
