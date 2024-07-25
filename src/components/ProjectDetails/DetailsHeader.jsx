import React from "react";
import Tooltip from "@mui/material/Tooltip";
import { NavLink } from "react-router-dom";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import DescriptionIcon from "@mui/icons-material/Description";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
const buttonStyles =
  "bg-softBlue text-white w-[256px] rounded-full flex items-center justify-between gap-2 border px-4 py-1 h-[44px] text-sm hover:bg-softBlue hover:text-white transition duration-300";
const DetailsHeader = () => {
  const user = useSelector((state) => state.projectDetails.permissions);
  const { t } = useTranslation();
  return (
    <div className="bg-customGray shadow-sm border border-gray-200 p-4 mb-4 rounded-sm">
      <div className="flex items-center gap-16">
        {user.isVisibleUpload && (
          <Tooltip title="Upload project-related images" arrow>
            <NavLink to="#">
              <button className={buttonStyles}>
                <span className="flex items-center gap-3">
                  <InsertPhotoIcon /> {t("actions.uploadPhoto")}
                </span>
                <ChevronRightIcon />
              </button>
            </NavLink>
          </Tooltip>
        )}

        {user.isVisibleAnalyze && (
          <Tooltip title="View and analyze project data" arrow>
            <button className={buttonStyles}>
              <span className="flex items-center gap-3">
                <AnalyticsIcon /> {t("actions.analyzePhoto")}
              </span>
              <ChevronRightIcon />
            </button>
          </Tooltip>
        )}
        {user.isVisibleReport && (
          <Tooltip title="Generate and view project reports" arrow>
            <button className={buttonStyles}>
              <span className="flex items-center gap-3">
                <DescriptionIcon />
                {t("actions.generateReport")}
              </span>
              <ChevronRightIcon />
            </button>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default DetailsHeader;
