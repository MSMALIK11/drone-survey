import React, { useState } from "react";

const TextareaControl = ({ name, value, onChange, placeholder, label }) => {
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div>
      <label className="text-md text-background">{label}</label>
      <textarea
        placeholder={placeholder}
        type="text"
        name={name}
        autoComplete="off"
        value={value}
        onChange={onChange}
        rows={3}
        className={`bg-white  px-4 py-2 mt-2  w-full input-control-wraper border-2 border-softgray flex items-center rounded-[20px] relative overflow-hidden ${
          isFocused ? " border border-softBlue" : ""
        }`}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
  );
};

export default TextareaControl;
