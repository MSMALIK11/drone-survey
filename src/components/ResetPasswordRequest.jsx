import React, { useEffect, useState } from 'react'
import logo from '../Images/logo2.png'
import { Box, TextField, Button, Link } from "@mui/material";
import OTPInput from "react-otp-input";
import PrimaryButton from '../shared/PrimaryButton';
import { isValidEmail } from '../helper/isValidemail';
import { errorHandler } from '../helper/handleError';
import useToast from '../hooks/useToast';
import api from '../services'
import LoopIcon from '@mui/icons-material/Loop';
import Loading from '../shared/Loading';
const ResetPasswordRequest = () => {
  const [otp, setOtp] = useState("")
  const [time, setTime] = useState(0);
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const toast = useToast()

  const handleOtpChange = (otp) => {
    console.log(otp)
    const numericValue = otp.replace(/\D/g, "");
    setOtp(numericValue);
    if (otp.length === 6) {
      handleOTPVerify(otp); // Call the function
    }
  };
  const handleEmail = (e) => {
    const { value } = e.target;
    if (!isValidEmail(value)) {
      setError("please enter a valid email")
      return
    }
    setError("")
    setEmail(value)

  }

  const handleRequestToOTP = async () => {
    setLoading(true)
    setOtp("")

    try {
      const payload = JSON.stringify({
        user_email: email
      })
      const res = await api.register.sendResetPasswordOTPEmail(payload)
      if (res.status === 201) {

        setLoading(false)
        setTime(59);
        toast('OTP sent to your registered email.', 'succes')
      }

    } catch (error) {
      setLoading(false)
      const message = errorHandler(error) || 'user does not exist'
      toast(message, 'error')
      console.error('Error::while calling  reset password otp  api request', error)


    }

  }
  // submit OTP verification
  const handleOTPVerify = async (otp) => {
    setIsLoading(true)

    try {
      const payload = {
        otp: otp,
        email:email
      }
      const res = await api.register.verifyOtp(payload)
      if (res.status === 201) {
        // Pending::  response token set to local storage
        localStorage.setItem('auth',JSON.stringify(payload))
        setIsLoading(false)
      }

    } catch (error) {
      setIsLoading(false)
      const message = errorHandler(error)
      toast(message, 'error')
    }
  }

  useEffect(() => {
    if (time > 0) {

      const timer = setTimeout(() => setTime(time - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [time]);
  let isDisabled = otp?.length !== 6
  let disabledResend = time != 0
 
  
  return (
    <div className='flex items-center justify-center h-screen'>
      <div className="border-2 rounded-sm px-8 pt-8 pb-12 w-[440px]">
        <div className="logInLogo flex justify-center">
          <img src={logo} alt="" width={250} />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Reset Password</h2>
          <p className='text-muted text-sm mt-2 mb-8'>Please enter the OTP sent to your registered email Id.</p>
          <div>
            <div className='relative'>

              <TextField
                error={!!error}
                helperText={error}
                placeholder="Type email"
                type="email"
                name="email"
                variant="outlined"
                fullWidth
                onChange={handleEmail}
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                className="loginField"
              />
              <p className='text-xs text-softBlue absolute right-0 top-[67px]  cursor-pointer text-right me-4 font-semibold' onClick={handleRequestToOTP}>
                {
                  loading && <LoopIcon className='text-softBlue !text-sm spin' />
                }
                <span className={`underline ${loading ? 'disabled' : ''}`}>

                  Request OTP
                </span>
              </p>
            </div>


            <div className='mt-6 mb-4'>

              <OTPInput
                value={otp}
                onChange={handleOtpChange}
                numInputs={6}
                separator={<span>-</span>}
                inputStyle="otp-input"
                renderInput={(props) => <input {...props} />}
              />
            </div>
            <PrimaryButton isLoading={isLoading} onClick={()=>handleOTPVerify(otp)} label="OTP SUBMIT" disabled={isDisabled} />
            <div className="flex justify-between mt-2 ms-2">
              <p className='text-sm'>Remaining time: 00:<span className='text-softBlue'>{time === 0 ? '59' : time}s</span></p>
              <p onClick={disabledResend ? null : handleRequestToOTP} className='!text-sm'>
                Don't get the code? <span className={`resend-link`}>Resend</span>{" "}
              </p>
            </div>
          </div>



        </div>

      </div>

      <Loading isVisible={isLoading} />
    </div>
  )
}

export default ResetPasswordRequest