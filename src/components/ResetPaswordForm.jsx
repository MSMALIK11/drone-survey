import React, { useEffect, useState } from 'react'
import logo from '../Images/logo2.png'
import { Box, TextField, Button, Link } from "@mui/material";
import PrimaryButton from '../shared/PrimaryButton';
import { errorHandler } from '../helper/handleError';
import useToast from '../hooks/useToast';
import api from '../services'
const ResetPasswordForm = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

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

            </div>
            <PrimaryButton  label="Submit"  />
           
          </div>



        </div>

      </div>
    </div>
  )
}

export default ResetPasswordForm