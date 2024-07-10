import { FormControl, MenuItem, Select } from '@mui/material';
import React, { useEffect, useState } from 'react';


const CompoBox = ({ options, onChange, name, label, value, disabled = false,selectLabel="label",selectValue="value" }) => {
  const [val, setValue] = useState("");

  const handleChange = (e) => {
    const { value, name } = e.target;
    setValue(value);
    if (onChange) {
      onChange(value, name);
    }
  };

  useEffect(() => {
    setValue(value);
  }, [value]);

  return (
    <FormControl sx={{ width: '100%' }}>
      {label && <label className='text-md text-background'>{label}</label>}
      <Select
        labelId="demo-simple-select-label"
        sx={{ borderRadius: '25px', height: '40px', minWidth: '116px' }}
        placeholder='Choose'
        onChange={handleChange}
        value={val}
        name={name}
        disabled={disabled}
        defaultValue={"solar"}
      >
        {
          options?.map((option)=>  <MenuItem key={option.value} value={option[selectValue]}>
          {option[selectLabel]}
        </MenuItem>)

        }
       
      </Select>
    </FormControl>
  );
};

export default CompoBox;
