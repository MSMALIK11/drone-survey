import React, { useState } from "react";
import { Badge, Button, Divider, IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import Checkbox from '@mui/material/Checkbox';

const FilterMenu = ({onItemClick}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedCount,setSelectedCount]=useState(0)
    const onMenuClick=(event)=>{
        setAnchorEl(event.currentTarget);
    }
    const onClose=()=>{
        setAnchorEl(null)
    }
   
      const handleMenuItemClick = (val) => {
    setSelectedItems((prev) =>
      prev.includes(val) ? prev.filter((item) => item !== val) : [...prev, val]
    );
  };

  const handleApplyClick = () => {
    onItemClick(selectedItems);
    setSelectedCount(selectedItems?.length)
    onClose();
  };

  const handleResetClick = () => {
    setSelectedItems([]);
    setSelectedCount(0)
    onClose();
  };
  return (
    <div>
  
      <Tooltip title="Filter Users" arrow>
        <IconButton
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={onMenuClick}
        >
            {
               selectedCount>0 ? <Badge badgeContent={selectedCount} color="primary">
                <FilterListIcon />
              </Badge>:<FilterListIcon />
            }
          
        </IconButton>
      </Tooltip>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        MenuListProps={{ "aria-labelledby": "basic-button" }}
      >
                 {["admin", "upload_image", "analysis_project", "generate_report"].map((item) => (
          <MenuItem key={item} onClick={() => handleMenuItemClick(item)} className=" h-[40px]">
            <Checkbox
              sx={{ marginLeft: '-10px' }}
              size="small"
              checked={selectedItems.includes(item)}
            />
            {item.charAt(0).toUpperCase() + item.slice(1).replace('_', ' ')}
          </MenuItem>
        ))}

        <Divider />
        <div className="flex justify-end gap-2 px-3">
        <Button size="small" variant="outlined" onClick={handleResetClick}>Reset</Button>
        <Button size="small" variant="contained" onClick={handleApplyClick}>Apply</Button>

        </div>
      </Menu>
    </div>
  );
};

export default FilterMenu;


