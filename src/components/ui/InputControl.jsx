import React, { useState } from "react";
import ErrorIcon from "@mui/icons-material/Error";
const InputControl = ({
  name,
  label,
  value,
  onChange,
  placeholder,
  error = null,
  disabled,
  helperText,
  primary = false,
  className,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div>
      {label && (
        <label className="text-md !text-background" htmlFor={name}>
          {label}
        </label>
      )}

      <div
        className={`${
          primary ? "bg-white border-2 !border-softgray" : "bg-softgray"
        } mt-1  ${className}  ${
          disabled ? "bg-inputDisabled" : ""
        }  input-control-wraper border border-transparent flex items-center  relative overflow-hidden ${
          !error && isFocused ? " !border !border-softBlue" : ""
        } ${error ? "!border !border-red-400" : ""}`}
      >
        <input
          id={name}
          placeholder={placeholder}
          type="text"
          name={name}
          autoComplete="off"
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="w-full input-control  h-full bg-transparent  px-4  text-background"
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>
      {helperText && (
        <p className="text-muted text-xs ms-2 mt-1">{helperText}</p>
      )}
      {error && (
        <p className="text-xs mt-1 flex items-center  gap-1 ms-1 text-red-500">
          {" "}
          <ErrorIcon style={{ fontsize: "12px" }} fontSize="small" /> {error}
        </p>
      )}
    </div>
  );
};

export default InputControl;
