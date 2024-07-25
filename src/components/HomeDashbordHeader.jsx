import { Box } from "@mui/material";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

const HomeDashbordHeader = () => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate("/project/new");
  };

  return (
    <>
      <Box className=" bg-black flex items-center justify-between px-4 h-[60px]">
        <div className="left_text text-white">
          <h4>Projects</h4>

          <p style={{ fontSize: "12px", color: "#b0b0b0" }}>
            Manage your projects here
          </p>
        </div>
        <div className="rigth_btn">
          <Button
            size="small"
            onClick={handleNavigation}
            startIcon={<AddIcon />}
            style={{
              fontFamily: "sans-serif",
              fontWeight: "bold",
              fontSize: "12px",
              backgroundColor: "#1c213e",
              padding: "4px 16px",
              borderRadius: "30px",
              color: "white",
            }}
          >
            New Project
          </Button>
        </div>
      </Box>
    </>
  );
};

export default HomeDashbordHeader;
