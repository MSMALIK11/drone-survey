import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { CANCEL, ASSIGN } from "../../constant/constant";
import api from "../../services";
import { errorHandler } from "../../helper/handleError";
import useToast from "../../hooks/useToast";
import { CircularProgress } from "@mui/material";
import { blue } from "@mui/material/colors";
const TransferOwnership = ({ isOpen, onClose, memberEmail }) => {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const handleTransferOwnership = async () => {
    setLoading(true);
    const payload =JSON.stringify( {
      member_email: memberEmail,
    })
    try {
      const res = await api.user.transferOwnership(payload);
      setLoading(false);
      onClose();
    } catch (error) {
      setLoading(false);
      const message = errorHandler(error);
      toast(message, "error");
      onClose();
      console.error("Error:: while calling transfer ownership api", error);
    }
  };
  
  return (
    <div className="mt-6">
      <Dialog open={isOpen} onClose={onClose}>
        <DialogTitle> Transfer Ownership </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to assign project ownership to{" "}
            <span className="font-semibold text-black">{memberEmail}</span>? You
            will transfer all administrative rights and responsibilities. This
            action can be reversed if necessary.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            {CANCEL}
          </Button>
          <Button
            variant="contained"
            disabled={loading}
            onClick={handleTransferOwnership}
          >
            {" "}
            {loading && (
              <CircularProgress size={22} sx={{ color: blue[500], mr: 2 }} />
            )}{" "}
            {ASSIGN}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TransferOwnership;
