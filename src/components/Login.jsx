import React, { useState } from "react";
import { Box, Button, Link } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../Images/logo2.png";
import useToast from "../hooks/useToast";
import { errorHandler } from "../helper/handleError";
import "../style/login.css";
import api from '../services'
import Loading from "../shared/Loading";
import PasswordControl from "./ui/PasswordControl";
import InputControl from "./ui/InputControl";
import Turnstile  from "react-turnstile";
import { isValidEmail } from "../helper/isValidemail";
import { useTranslation } from 'react-i18next';
const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(false)
  const [error,setError]=useState(false)
  const{t}=useTranslation()
const toast=useToast()

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
    const isValid=isValidEmail(value)
    if(!isValid){
      setError(true)
    }else{
      setError(false)
      
    } 
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
  const handleVerify = async (token) => {
    console.log('verified', token)
    const SECRET_KEY = "0x4AAAAAAAc19MLJ4z2_D4v-oDvm2R_Gv1o"
    setToken(token)
    // try {
    //   // const res=await api.register.verifyTurnstile(secretkey,token)
    //   // console.log('transtile res',res)
    //   const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/x-www-form-urlencoded',
    //     },
    //     body: `secret=${SECRET_KEY}&response=${token}`,
    //   });

    // } catch (error) {
    //   console.error("Error::", error)

    // }


  }

  const isDisabled = !email || !password || !token || !!error;
  return (
    <Box className=" h-screen overflow-hidden flex items-center justify-center">
      <Box className="border-2 rounded-sm px-12 py-20 pb-12 w-[525px] min-h-[70%]">
        <div className=" flex justify-center">
          <img src={Logo} alt="" width={360} />
        </div>
        <h2 className="!text-3xl mt-9 font-semibold">{t('label.login')}</h2>
        <p
         className="text-muted mt-4 text-sm"
        >
          {t('label.accessMessage')}
        </p>
 
        <div className="mt-11">
          <div className="space-y-7">
            <InputControl error={error?t('errorMessage.invalidEmailError'):null} name={"email"} onChange={handleChange} placeholder={t('placeholder.enterEmail')} />
          <PasswordControl onFocus={()=>{}} name={"password"} key={"password"} value={password} onChange={handleChange} onkeydown={handleKeyDown} placeholder={t('placeholder.enterPassword')} />
          </div>
        <div className="flex justify-end mt-1">
        <NavLink
          to="/password-reset/request"
          className="text-md !text-softBlue underline"
        >
         {t('label.forgotPassword')}
        </NavLink>
          
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
          className="text-muted text-md mt-2 ms-2"
        >
         {t('label.notRegisteredYet')}
          <NavLink
          to="/newSignUp"
          style={{ textDecoration: "none", fontWeight: 700 }}
          className="forgotpassword text-md"
        >
        <span className="text-softBlue !text-md"> {t('label.signUpNow')}</span>
        </NavLink>
             
        </p>
      </Box>
      <Loading isVisible={loading} />
    </Box>
  );
};

export default Login;
