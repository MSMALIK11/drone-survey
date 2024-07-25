import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment, TextField } from "@mui/material";

const InputSearchControl = ({ handleSearch, hintText }) => {
  return (
    <TextField
      size="small"
      variant="outlined"
      placeholder={hintText}
      onChange={handleSearch}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      className="inputSearchControl"
    />
  );
};

export default InputSearchControl;
