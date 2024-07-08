import React, { useState } from 'react'

const TextareaControl = ({name, value, onChange,placeholder,label}) => {
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div>
      <label>{label}</label>
    <textarea
      placeholder={placeholder}
      type="text"
      name={name}
      autoComplete="off"
      value={value}
      onChange={onChange}
// cols={2}
// rows={4}
      className={`bg-softgray px-4 py-2  w-full input-control-wraper border border-transparent flex items-center rounded-[25px] relative overflow-hidden ${isFocused?' border border-softBlue':''}`}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  </div>
  )
}

export default TextareaControl