import React, { useState } from 'react';
import { IconButton, InputAdornment, TextField, styled } from '@mui/material';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const StyledIconButton = styled(IconButton)({
  color: "white",
});



const PasswordControl = ({ value, onChange,name ,onkeydown ,className,onFocus}) => {
  const [show, setShow] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const onShowToggle = () => {
    setShow(!show);
   
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocus()
  };

  const handleBlur = () => {
    setIsFocused(false);
    onFocus()
  };

  return (
    <div>

    <div className={`bg-softgray input-control-wraper border border-transparent flex items-center  relative overflow-hidden ${isFocused?' !border !border-softBlue':''}`}>
    
      <input
        placeholder="Password"
        type={show ? "text" : "password"}
        name={name}
        autoComplete="new-password"
        value={value}
        onChange={onChange}
        onKeyDown={onkeydown}
        className='w-full input-control  bg-transparent  rounded-full px-4  text-background'
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <div className='absolute right-0 top-0'>
      
          <StyledIconButton onClick={onShowToggle}>
            {show ? <Visibility className='text-background' /> : <VisibilityOff className='text-background' />}
          </StyledIconButton>
       
      </div>


    </div>
    </div>
  );
};

export default PasswordControl;
