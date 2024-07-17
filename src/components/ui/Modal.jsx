import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { CANCEL } from "../../constant/constant";
import { CircularProgress, IconButton } from "@mui/material";
import { blue } from "@mui/material/colors";
import Close from "@mui/icons-material/Close";
const Modal = ({ isOpen, onClose, onClick, loading, submitText, children,title,disabled,width }) => {
  return (
    <Dialog open={isOpen} onClose={onClose}

    sx={{ '& .MuiDialog-paper': { width: width } }}
    >
      <DialogTitle>{ title}  <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "inherit",
          }}
        >
          <Close />
        </IconButton>  </DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions className="mb-3 mx-4">
        <Button variant="outlined" size="" sx={{borderRadius:'25px'}} onClick={onClose}>
          {CANCEL}
        </Button>
        <Button variant="contained"  sx={{borderRadius:'25px',padding:"4px 16px",minWidth:'100px'}} disabled={loading || disabled} onClick={onClick}>
          {" "}
          {loading && (
            <CircularProgress size={22} sx={{ color: blue[500], mr: 2 }} />
          )}{" "}
          {submitText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Modal;
