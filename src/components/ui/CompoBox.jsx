import { FormControl, MenuItem, Select, styled } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const CompoBox = ({ options, onChange, name, label, value, disabled = false,selectLabel="label",selectValue="value",isDefaultVisible=true }) => {
  const [val, setValue] = useState("");
const { t }=useTranslation()
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
      {label && <label className='text-md mb-2 text-background'>{label}</label>}
      <Select
        labelId="demo-simple-select-label"
        sx={{ borderRadius: '25px', height: '40px', minWidth: '126px' }}
        placeholder='Choose'
        onChange={handleChange}
        value={val}
        name={name}
        disabled={disabled}
    
      >
        {
          isDefaultVisible &&          <MenuItem value="default" >{t('label.select')}</MenuItem> 
        }

        {
          options?.map((option)=>  <MenuItem className='hover:text-softBlue' key={option.value} value={option[selectValue]}>
          {option[selectLabel]}
        </MenuItem>)

        }
       
      </Select>
    </FormControl>
  );
};

export default CompoBox;
