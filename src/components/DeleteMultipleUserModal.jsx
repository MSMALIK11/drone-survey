import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { CANCEL, CONFIRM } from "../../constant/constant";

import useToast from "../../hooks/useToast";
import { CircularProgress } from "@mui/material";
import { blue } from "@mui/material/colors";
const DeleteMultipleUserModal = ({
  isOpen,
  onClose,
  delUsersList,
  handleRemoveUser,
}) => {
  const [loading] = useState(false);

  return (
    <div className="mt-6">
      <Dialog open={isOpen} onClose={onClose}>
        <DialogTitle>Confirmation </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove{" "}
            <span className="font-semibold text-black">
              {delUsersList.length > 1 ? delUsersList.length : delUsersList[0]}{" "}
              {delUsersList.length > 1 ? "users" : "user"}
            </span>{" "}
            from the project? This will remove their access and permissions.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            {CANCEL}
          </Button>
          <Button
            variant="contained"
            disabled={loading}
            onClick={handleRemoveUser}
          >
            {" "}
            {loading && (
              <CircularProgress size={22} sx={{ color: blue[500], mr: 2 }} />
            )}{" "}
            {CONFIRM}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeleteMultipleUserModal;
