import React, { useEffect, useState } from 'react';

const CustomDropdown = ({options,onChange,name,label,value}) => {
  const [val,setValue]=useState("")
 
const handleChange=(e)=>{
  setValue(e.target.value)
  onChange(e.target.value || null,e.target.name)
}

useEffect(()=>{
  setValue(value)

},[value])
  return (
    <div>
      
   
     {
       label && <label className='text-sm text-background'>{label}</label>
     } 
    <div className='custom-select'>

     <select onChange={handleChange} name={name} value={value}>
  {options.length > 0 
    ? options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      )) 
    : <option disabled>Not data found</option>
  }
</select>

    </div>

    </div>
  );
};

export default CustomDropdown;
