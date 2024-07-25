import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import {
  IconButton,
  Typography,
  Box,
  DialogActions,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import InputControl from "../ui/InputControl";
import UploadProfile from "./UploadProfile";
import { formatDate } from "../../helper/formateDate";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useTranslation } from "react-i18next";
const LoginInfo = ({ user, open, onClose, isLoading }) => {
  // const [userData, setUserData] = useState(user);
  const [isShowUpload, setIsShowUpload] = useState(false);
  const { t } = useTranslation();
  const onShowToggleUpload = () => {
    setIsShowUpload(!isShowUpload);
  };
  // const handleInputChange = (event) => {
  //   const { name, value } = event.target;
  //   setUserData((prev) => ({ ...prev, [name]: value }));
  // };
  const handleSaveChanges = () => {};
  const handleClose = () => {
    setIsShowUpload(false);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: 600,
          bgcolor: "#F8F8F8",
          // bgcolor:"light-grey",

          boxShadow: 24,
          borderRadius: "30px",
          padding: "10px 12px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <IconButton
          // edge="end"
          // color="inherit"
          className=" w-[28px]"
          onClick={handleClose}
          sx={{ position: "absolute", top: 0, right: 0, padding: "20px 32px" }}
        >
          {/*  */}
          <CloseIcon style={{ color: "gray" }} />
        </IconButton>

        <Box className="p-4">
          <Box>
            <Box className="flex gap-6 ">
              <div className="relative bg-[#D9D9D9] w-[108px] flex items-center justify-center h-[108px] rounded-full p-2">
                <PersonIcon sx={{ fontSize: "70px" }} />
                <Tooltip title="Upload profile">
                  <span
                    tabIndex={0}
                    onClick={onShowToggleUpload}
                    className="absolute  hover:cursor-pointer right-[12px] bottom-[0px] w-[24px] h-[24px] text-white bg-gray-500 hover:bg-softBlue rounded-full flex items-center justify-center"
                  >
                    <EditIcon className="!text-sm" />
                  </span>
                </Tooltip>
              </div>
              <Typography
                variant="h5"
                className="pt-4 text-background !font-semibold"
              >
                {t("label.userInfo")}
              </Typography>
            </Box>

            <div className="px-4  text-background flex flex-col gap-4">
              <hr className="mt-4" />
              <InputControl
                label={t("label.name")}
                primary
                value={user?.name}
              />
              <hr />
              <InputControl
                label={t("label.email")}
                primary
                value={user?.email}
              />
              <hr />
              <div className="flex flex-col gap-1">
                <label>{t("label.dob")}</label>
                <input
                  type="date"
                  className="!bg-white !border-2 !border-softgray"
                  placeholder="DD/MM/YYYY"
                />
              </div>
              <hr />
              <div className="flex flex-col gap-1">
                <label>{t("label.about")}</label>
                <textarea
                  value={user?.about}
                  rows={3}
                  placeholder="Iam join..."
                  className="border-2 border-softgray rounded-[20px] p-4"
                />
              </div>
              <div>
                <p className="text-md mt-4 flex flex-col gap-2">
                  <label className="text-background text-md">
                    {t("label.createdAt")}
                  </label>
                  <span className="bg-blueTag w-[274px] !text-white px-4 py-1 rounded-full flex gap-2 items-center">
                    <AccessTimeIcon /> {formatDate(user?.created_at)}
                  </span>
                </p>
              </div>
            </div>
          </Box>
        </Box>
        <DialogActions>
          <Button
            size="small"
            sx={{ borderRadius: "25px" }}
            autoFocus
            onClick={handleClose}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            size="small"
            sx={{ borderRadius: "25px" }}
            disabled={isLoading}
            variant="contained"
            autoFocus
            onClick={handleSaveChanges}
            className="loginBtn"
          >
            {isLoading && <CircularProgress size={18} />}
            Save
          </Button>
        </DialogActions>
        {isShowUpload && (
          <div className="absolute top-[140px]  left-4 right-3 w-full">
            <UploadProfile onCancel={onShowToggleUpload} />
          </div>
        )}
      </Box>
    </Modal>
  );
};

export default LoginInfo;
