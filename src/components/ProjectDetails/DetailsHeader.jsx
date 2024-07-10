import React from "react";
import ImageIcon from "@mui/icons-material/Image";
import PollIcon from "@mui/icons-material/Poll";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import Tooltip from "@mui/material/Tooltip";
import { NavLink } from "react-router-dom";

const DetailsHeader = () => {
  const buttonStyles = "bg-white rounded-full flex items-center gap-2 border px-4 py-1 h-[40px] text-sm hover:bg-softBlue hover:text-white transition duration-300";

  return (
 
    <div className="bg-customGray shadow-sm border border-gray-200 p-4 mb-4 rounded-sm">
      <div className="flex items-center gap-4">
        <Tooltip title="Upload project-related images" arrow>
          <NavLink to='/upload'>
            <button className={buttonStyles}>
              <ImageIcon /> Upload Image
            </button>
          </NavLink>
        </Tooltip>
        <Tooltip title="View and analyze project data" arrow>
          <button className={buttonStyles}>
            <PollIcon /> Analyze Project
          </button>
        </Tooltip>
        <Tooltip title="Generate and view project reports" arrow>
          <button className={buttonStyles}>
            <AccountTreeIcon /> Generate Report
          </button>
        </Tooltip>
      </div>
    </div>

  );
};

export default DetailsHeader;
