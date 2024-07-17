import { Box } from '@mui/material'
import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import '../style/signup.css'


const SignUp = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
      });
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();

      };

      const navigate = useNavigate();

  const handleRedirectLogin = () => {
    navigate('/Login'); // Replace '/target-route' with the route you want to redirect to
  };
  return (
    <>
    <Box className="signup_section" >
    <Box  className="main_signup" >
      

    <form onSubmit={handleSubmit}>
   <Box className="logo_img"></Box> 
     <Box className="signup_heading">
        <h1>Sign Up</h1>
        </Box>  
      <TextField
        label="First Name"
        variant="outlined"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        fullWidth
        className="custom-textfield"
        margin="dense"

      />
      <TextField
        label="Last Name"
        variant="outlined"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        fullWidth
        margin="dense"
      />
      <TextField
        label="Email"
        variant="outlined"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        fullWidth
        margin="dense"
        
      />
      <TextField
        label="Password"
        variant="outlined"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        fullWidth
        margin="dense"
       
      />
      <p className='sign_para'>By Signing up you accept the <span className='terms_con'>Terms & condition</span> </p>
      <Button
       type="submit" 
       variant="contained" 
       color="primary"
       fullWidth
       margin="normal"

       >
        Sign Up
      </Button>
      <p className='log_text'> 
        By Signing up you accept the    <NavLink to="/login">  <span className='log_in' onClick={handleRedirectLogin} > ?  Log In </span> </NavLink>.
      </p>
    </form>
    </Box>
    </Box>
    </>
  )
}

export default SignUp