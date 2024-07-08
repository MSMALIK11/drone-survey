import React, { useState } from "react";
import { Box, TextField, Button, Link } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/system";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../Images/logo2.png";
import useToast from "../hooks/useToast";
import { errorHandler } from "../helper/handleError";
import "../style/login.css";
import api from '../services'
import Loading from "../shared/Loading";
import PasswordControl from "./ui/PasswordControl";
import InputControl from "./ui/InputControl";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
const toast=useToast()

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };



  const handleLogin = async () => {
    setLoading(true);
    try {
      const res=await api.register.login({email,password})
      if(res.status===201){
        toast(res?.data?.message,'success')
        localStorage.setItem('auth',JSON.stringify({email,password}))
        localStorage.setItem('OtpTitle',"Login")
        setLoading(false)
       navigate('/otp')
      }
      
    } catch (error) {
      const errorMessage=errorHandler(error)
      setLoading(false);
      toast(errorMessage,'error')
      
    }
  };
  const handleKeyDown=(e)=>{
    if(e.key=="Enter"){
      handleLogin()

    }
  }

  const isDisabled = !email || !password;

  return (
    <Box className="main-login">
      <Box className="border-2 rounded-sm px-8 pt-8 pb-12 w-[440px]">
        <div className="logInLogo flex justify-center">
          <img src={Logo} alt="" width={200} />
        </div>
        <h2 className="text-2xl font-semibold">Login</h2>
        <p
         className="text-muted mt-4 mb-12 text-sm"
        >
          Enter your Credentials to access your account
        </p>
 
        <div>
          <div className="space-y-4">
            <InputControl name={"email"} onChange={handleChange} placeholder={"Email"} />
          <PasswordControl name={"password"} key={"password"} value={password} onChange={handleChange} onkeydown={handleKeyDown}  />
          </div>
        <div className="flex justify-end mt-1">
        <NavLink
          to="/password-reset/request"
          className="text-sm !text-softBlue"
        >
          Forgot Password?
        </NavLink>
          
        </div>

        </div>
        <Button
          variant="contained"
          fullWidth
          className="loginBtn !mt-4"
          onClick={handleLogin}
          disabled={isDisabled || loading}  
        >
           {loading ? (
                      <CircularProgress size={'1.3rem'}  style={{ color: "white" }} />
                    ) : (
                      "Login"
                    )}
        </Button>
        <p
          className="text-muted text-sm mt-2 ms-2 text-xs"
        >
          Not Registered Yet ?{" "}
          <NavLink
          to="/newSignUp"
          style={{ textDecoration: "none", fontWeight: 700 }}
          className="forgotpassword"
        >
        <span className="text-softBlue">  Sign Up Now ?</span>
        </NavLink>
             
        </p>
      </Box>
      <Loading isVisible={loading} />
    </Box>
  );
};

export default Login;
