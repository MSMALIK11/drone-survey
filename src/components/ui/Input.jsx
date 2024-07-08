import React, { useState } from 'react';
import ErrorIcon from '@mui/icons-material/Error';
const InputControl = ({name,label, value, onChange,placeholder,error=null }) => {
  const [isFocused, setIsFocused] = useState(false);


  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div >
      {
        label &&    <label className='text-md text-background' htmlFor="">{label}</label>
      }


    <div id="input-light" className={`bg-white  border  !h-[24px] flex items-center rounded-full relative overflow-hidden ${isFocused?' border border-softBlue':''}`}>
      <input
        placeholder={placeholder}
        type="text"
        name={name}
        autoComplete="off"
        value={value}
        onChange={onChange}
        className='w-full   h-full bg-transparent  rounded-full  text-background'
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
    {
      error && <p className='text-xs mt-1 flex items-center  gap-1 ms-1 text-red-500'> <ErrorIcon style={{fontsize:"12px"}} fontSize='small'  /> {error}</p>
    }
     
    </div>

  );
};

export default InputControl;
