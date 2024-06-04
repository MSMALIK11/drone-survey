import React, { useState, useEffect } from 'react';
import OTPInput from 'react-otp-input';
import Logo from "../Images/logo2.png";
import '../style/otp.css' 

const OtpModel = () => {
  const [otp, setOtp] = useState('');
  const [time, setTime] = useState(60);
  const [isResendVisible, setIsResendVisible] = useState(false);


  useEffect(() => {
    if (time > 0) {
      const timer = setTimeout(() => setTime(time - 1), 1000);
      return () => clearTimeout(timer);    
    } else {
      setIsResendVisible(true);
    }
  }, [time]);

  const handleOtpChange = (otp) => {
    setOtp(otp);
  };

  const handleSubmit = () => {
    // Add logic to handle OTP 
    console.log('OTP Submitted:', otp);
  };

  const handleResend = () => {
    setTime(60);
    setIsResendVisible(false);
    console.log('OTP Resend');
  };

  return (
    <div className="forgot-password-container">
    <div className="forgot-password-main">
      <img src={Logo} alt="Logo"  style={{marginBottom:"30px", width:"80%" }}  />
      <h1 style={{marginLeft:"-317px"}}>Login</h1>
      <p>Please enter the OTP sent to your registered email ID.</p>
      <OTPInput
        value={otp}
        onChange={handleOtpChange}
        numInputs={6}
        separator={<span>-</span>}
        inputStyle="otp-input"
        renderInput={(props) => <input {...props} />}
      />

      <button onClick={handleSubmit} className="reset-button">
        Login
      </button>
      <div className="timer-container">
      <p style={{fontSize:"12px"}}>Remaining time: 00:{time}s</p>
      <p onClick={handleResend}  style={{fontSize:"12px"}} >Don't get the code?  <span className="resend-link">Resend</span>  </p>
      </div>
    </div>
    </div>
  );
};

export default OtpModel;