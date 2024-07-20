import React, { useState,useCallback,useEffect } from "react";
import {
  Badge,
  Button,
  Divider,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import Checkbox from "@mui/material/Checkbox";
import {getAccessLevel} from '../../helper/getAccessLevel'
import { useQueryClient } from "react-query";
import {setFilters,setActiveFilterCount,resetFilters} from '../../store/filtersSlice'
import {useDispatch, useSelector} from 'react-redux'
const filterInitialState = {
  is_admin: false,
  is_owner: false,
  is_analyzer:"",
  is_reporter: "",
  is_uploader: "",
  last_evaluated_key: {},
};
const filterMenuItems = [
 
  {
    name:"Upload Photo",
    key:"is_uploader"
  },
  {
    name:"Analyze photo",
    key:"is_analyzer"
  },
 
  {
    name:"Generate Report",
    key:"is_reporter"
  },
 
];
const FilterMenu = ({ onItemClick,onResetFilter }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [selectedFilter, setSelectedFilter] = useState(filterInitialState);
  const [selectedItems, setSelectedItems] = useState([]);
  const queryClient=useQueryClient()
const {totalActiveFilterCount:selectedCount,filters}=useSelector((state)=>state.userFilter)
  const [filtersData,setFiltersData]=useState({
    is_admin:false,
    is_owner:false,
    is_uploader:{
      read:false,
      write:false
    },
    is_analyzer:{
      read:false,
      write:false
    },
    is_reporter:{
      read:false,
      write:false
    },

  })
  const dispatch=useDispatch()
  const onMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
    console.log('Object.keys(filters)',Object.keys(filters).length)
    if(Object.keys(filters).length===1) return 
    setFiltersData(filters)
  };
  const onClose = () => {
    setAnchorEl(null);
  };

  const handleFilterAdminAndOwner=(e)=>{
   const{name,checked}=e.target
   setFiltersData((prev)=>({...prev,[name]:checked}))

  }
 
  const handleApplyClick = () => {
    const accessLevel = {
      is_admin: filtersData.is_admin,
      is_owner: filtersData.is_owner,
      is_analyzer: getAccessLevel(filtersData.is_analyzer),
      is_reporter: getAccessLevel(filtersData.is_reporter),
      is_uploader: getAccessLevel(filtersData.is_uploader),
      last_evaluated_key: {},
      initial: true,
    };
    onItemClick(accessLevel);
    dispatch(setFilters(filtersData))
    dispatch(setActiveFilterCount())
    onClose();
  };

  const handleResetClick = () => {
    setSelectedItems([]);
    onItemClick(filterInitialState);
    dispatch(resetFilters())
    onResetFilter()
    // queryClient.invalidateQueries(['getProjectUsersList']);
    onClose();
  };
  const handleReadWriteClick = (e) => {
    const { name, value } = e.target;
    const [key, subKey] = name.split('.');
 
    setFiltersData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [subKey]: !prev[key][subKey],
      },
    }));
    // console.log('filterdData',filtersData)
    // console.log('filters',filters)


  };

  return (
    <div>

      <Tooltip title="Filter Users" arrow>
        <Button
          onClick={onMenuClick}
          id="basic-button"
          variant="outlined"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          sx={{ marginRight: "6px", borderRadius: "25px" }}
        >
          {selectedCount > 0 ? (
            <Badge
              sx={{ fontSize: "12px" }}
              badgeContent={selectedCount}
              color="primary"
            >
              <FilterListIcon fontSize="small" sx={{ marginRight: "8px" }} />
            </Badge>
          ) : (
            <FilterListIcon fontSize="small" sx={{ marginRight: "8px" }} />
          )}
          Filter
        </Button>
      </Tooltip>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        MenuListProps={{ "aria-labelledby": "basic-button" }}
      >
        <div className="flex items-center justify-between px-4 w-[270px] h-[60px] border-b ">
    <div>
      <Checkbox size="small" name="is_admin" checked={filtersData?.is_admin} onClick={(e)=>handleFilterAdminAndOwner(e)}   /> Admin
    </div>
    <div >
      <Checkbox size="small" name="is_owner" checked={filtersData?.is_owner} onClick={(e)=>handleFilterAdminAndOwner(e)}   /> Owner
    </div>
  </div>
  <div className=" px-2">
        {filterMenuItems.map(
          (item) => (
            <div
              sx={{ minWidth: "270px" }}
              key={item.name}
              className="px-4 mt-3 border-b"
            >
              {/* <Checkbox
                sx={{ marginLeft: "-10px" }}
                size="small"
                checked={selectedItems.includes(item.name)}
              /> */}
          <p className='text-md text-background'> {item.name}</p>
           {item.name !== "Admin" && item.name !== "Owner" && (
  <div className="flex">
  <div>
  
    <Checkbox size="small" name={`${item.key}.read`} checked={filtersData[item.key]?.read} onClick={handleReadWriteClick} /> Read
  </div>
  <div>
    <Checkbox size="small" name={`${item.key}.write`} checked={filtersData[item.key]?.write} onClick={handleReadWriteClick} /> Write
  </div>
</div>
)}
            </div>
          )
        )}

  </div>
        


        {/* <div className="flex flex-col">
          <MenuItem sx={{ marginLeft: "-10px" }} className=" h-[40px]">
            <Checkbox size="small" /> Read
          </MenuItem>
          <MenuItem sx={{ marginLeft: "-10px" }} className=" h-[40px]">
            <Checkbox size="small" /> Write
          </MenuItem>
        </div> */}

        <Divider />
        <div className="flex  justify-end gap-2 px-3 py-3">
          <Button size="small" variant="outlined" onClick={handleResetClick}>
            Reset
          </Button>
          <Button size="small" variant="contained" onClick={handleApplyClick}>
            Apply
          </Button>
        </div>
      </Menu>
    </div>
  );
};

export default React.memo(FilterMenu);
