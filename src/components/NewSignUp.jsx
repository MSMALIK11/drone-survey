import React, { useState } from "react";
import { Box, Button, Link } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../Images/logo2.png";
import Turnstile from "react-turnstile";
import "../style/login.css";
import api from '../services'
import useToast from "../hooks/useToast";
import { errorHandler } from "../helper/handleError";
import PasswordControl from "./ui/PasswordControl";
import InputControl from "./ui/InputControl";
import { isValidEmail } from "../helper/isValidemail";
import { ACCESS_MESSAGE, INVALID_EMAIL_ERROR_MESSAGE } from "../constant/constant";
import { validatePassword } from "../helper/validatePassword";
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
const NewSignUp = () => {
  const [token, setToken] = useState(false)
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [error,setError]=useState(null)
  const [passwordError,setPasswordError]=useState(false)
  const [loading, setLoading] = useState(false);
  const [showPasswordIfo,setShowPasswordInfo]=useState(false)
  const navigate = useNavigate();
  const [validation, setValidation] = useState({
    lowercase: false,
    uppercase: false,
    number: false,
    length: false,
  });

  const toast = useToast()
  const handleChange = (e) => {
    const { name, value } = e.target;
    if(name==="email" && !isValidEmail(value)){
      setError(INVALID_EMAIL_ERROR_MESSAGE)
    }else{
      setError(null)
    }
    if(name==="password"){
      setValidation({
        lowercase: /[a-z]/.test(value),
        uppercase: /[A-Z]/.test(value),
        number: /[0-9]/.test(value),
        length: value.length >= 8,
      });

    }
    
    setUser(prev => ({ ...prev, [name]: value }));
  };
  const isDisabled = !user.email || !user.password || !user.name || !token || !Object.values(validation).every(Boolean);

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await api.register.signup(user)
      if (res.status = 201) {
        const message = res?.data?.message
        toast(message, 'success')
        setToken("")
        setLoading(false)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error while calling singup api', error)
      const errorMessage = errorHandler(error)
      toast(errorMessage, 'error')
      setLoading(false)

    }
  }
  const handleVerify = async (token) => {
    console.log('verified', token)
    const SECRET_KEY = "0x4AAAAAAAc19MLJ4z2_D4v-oDvm2R_Gv1o"
    setToken(token)
    try {
      // const res=await api.register.verifyTurnstile(secretkey,token)
      // console.log('transtile res',res)
      const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${SECRET_KEY}&response=${token}`,
      });

    } catch (error) {
      console.error("Error::", error)

    }


  }
  return (
    <>
      <Box className="main-login">
      <Box className="border-2 rounded-sm px-12 lg:py-20 sm:py-12 pb-12 w-[525px] min-h-[70%]  ">
      <div className=" flex justify-center">
          <img src={Logo} alt="botlab" width={360} />
        </div>
       
          <h2 className="text-3xl font-semibold mt-9">Sign up</h2>
          <p
         className="text-muted mt-2 text-md"
        >
        {ACCESS_MESSAGE}
        </p>

          <div className="flex flex-col gap-4 mt-11">
            <InputControl placeholder={"Username"} name="name" // Add name prop
              value={user.name}
              onChange={handleChange} />
            <InputControl    error={error?error:null} placeholder={"Email"} name={"email"} value={user.email}
              onChange={handleChange} />
              <div className="relative">
            <PasswordControl onFocus={()=>setShowPasswordInfo(!showPasswordIfo)} value={user.password} name="password" onChange={handleChange} />
            <div className="flex justify-end">
            <p
           className="text-muted mt-2"
          >
            Already have an account?{" "}
            <NavLink
              to="/login"
              style={{
                textDecoration: "none",
                fontWeight: 700,
                color: "rgba(23, 124, 240, 1)",
              }}
              className="forgotpassword"
            >
              Login
            </NavLink>
          </p>
            </div>
            {
              showPasswordIfo && <div id="password-message" className="text-sm bg-white shadow-lg p-3 w-full absolute top-[44px] rounded-lg">
              <p className="text-xs flex items-center gap-1"> {validation.lowercase?<DoneIcon sx={{color:'green'}} />:<CloseIcon sx={{color:'red',fontSize:'16px'}} />} At least one lowercase letter</p>
              <p className="text-xs flex items-center gap-1">{validation.uppercase?<DoneIcon sx={{color:'green'}} />:<CloseIcon sx={{color:'red',fontSize:'16px'}}  />} At least one uppercase letter</p>
              <p className="text-xs flex items-center gap-1">{validation.number? <DoneIcon sx={{color:'green'}} />:<CloseIcon sx={{color:'red',fontSize:'16px'}} />} At least one number</p>
              <p className="text-xs flex items-center gap-1"> {validation.length? <DoneIcon sx={{color:'green'}} />:<CloseIcon sx={{color:'red',fontSize:'16px'}} />} Minimum 8 characters</p>
            </div> 
            }

              </div>
            
          </div>
          <div className=" mt-4">
            <Turnstile
              className="mb-4 !w-full !rounded-lg"
              // executution="execute"
              // appearance="always"
              sitekey="0x4AAAAAAAc19PLhfHqn4C6y"
              onVerify={handleVerify}

            />
          </div>
          <Button
            variant="contained"
            fullWidth
            className="loginBtn mt-4"
            onClick={handleSubmit}
            disabled={isDisabled || loading}
          >
            {loading && <CircularProgress size={'1.3rem'} style={{ color: "white" }} />}
            {loading ? "Register..." : "Register"}
          </Button>

         
        </Box>
      </Box>
    </>
  );
};

export default NewSignUp;
