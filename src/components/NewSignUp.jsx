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
import Turnstile, { useTurnstile } from "react-turnstile";
import "../style/login.css";
import api from '../services'
import useToast from "../hooks/useToast";
// import { Turnstile } from '@marsidev/react-turnstile'
import { errorHandler } from "../helper/handleError";
import PasswordControl from "./ui/PasswordControl";
import InputControl from "./ui/InputControl";

// site key in the HTML code your site serves to users. =>  6Lfk-dEpAAAAAFKRUVL3DOCB3gjiX3Ib5PQ7XPoX
// communicate btw site and recapcha => 6Lfk-dEpAAAAAOrMp7sVP7AjNZ77ek5j_8vOFQam

function onChange(value) {
  console.log("Captcha value:", value);
}
const NewSignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(false)
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isFocusPasswod, setIsFocusPassword] = useState(false); // we are using it for confirm password Focus
  const toast = useToast()
  const StyledIconButton = styled(IconButton)({
    color: "white", // Adjust the color here
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleClickShowConfirmPassword = () => {
    console.log(showConfirmPassword, "value of passwordata");
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleConfirmFocus = () => {
    setIsFocusPassword(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };
  const handleBlurPassword = () => {
    // we are using for Confirm Password Blur
    setIsFocusPassword(false);
  };


  // const turnstile = useTurnstile();

  const isDisabled = !user.email || !user.password || !user.name || !token;

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
        <Box className="signup-form">
          <div className="logInLogo">
            <img src={Logo} alt="" height={20} width={270} />
          </div>
          <h2 style={{ fontFamily: "sans-serif", fontWeight: 700 }}>Sign up</h2>
          <p
            style={{
              color: "gray",
              fontWeight: 500,
              fontFamily: "sans-serif",
              marginTop: "14px",
              marginBottom: "20px",
              fontSize: "13px",
            }}
          >
            Enter your Credentials to access your account
          </p>

          <div className="flex flex-col gap-4">
            <InputControl placeholder={"Username"} name="name" // Add name prop
              value={user.name}
              onChange={handleChange} />
            <InputControl placeholder={"Email"} name={"email"} value={user.email}
              onChange={handleChange} />
            <PasswordControl value={user.password} name="password" onChange={handleChange} />
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

          <p
            style={{

              fontFamily: "sans-serif",
              fontSize: "12px",
              color: "gray",
              fontWeight: 500,
              textAlign: "center",
              display: "block",
              marginTop: "16px",
            }}
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
              Sign in
            </NavLink>
          </p>
        </Box>
      </Box>
    </>
  );
};

export default NewSignUp;
