import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import api from "../../services";
import { errorHandler } from "../../helper/handleError";
import useToast from "../../hooks/useToast";
import { CircularProgress, IconButton } from "@mui/material";
import { blue } from "@mui/material/colors";
import InputControl from "../ui/InputControl";
import { useQueryClient } from "react-query";
import { useTranslation } from "react-i18next";
import Close from "@mui/icons-material/Close";
const TransferOwnership = ({ isOpen, onClose, memberEmail }) => {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [email, setEmail] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const handleTransferOwnership = async () => {
    setLoading(true);
    const payload = JSON.stringify({
      member_email: memberEmail,
    });
    try {
      const res = await api.user.transferOwnership(payload);
      if (res.status == 201) {
        toast(
          t("messages.ownershipTransferSuccessMessage", { email: memberEmail }),
          "success"
        );
        queryClient.invalidateQueries(["getProjectUsersList"]);
        setLoading(false);
        window.location.reload();
        onClose();
      }
    } catch (error) {
      setLoading(false);
      const message = errorHandler(error);
      toast(message, "error");
      onClose();
      console.error("Error:: while calling transfer ownership api", error);
    }
  };

  const handleChange = (event) => {
    const { value } = event.target;
    if (memberEmail != value) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
    setEmail(value);
  };
  return (
    <div className="mt-6">
      <Dialog open={isOpen} onClose={onClose}>
        <DialogTitle> Transfer Ownership 
          <IconButton
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
        </IconButton> </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to assign project ownership to{" "}
            <span className="font-semibold text-black">{memberEmail}</span>? You
            will transfer all administrative rights and responsibilities.
            <div className="mt-6">
              <InputControl
                onChange={handleChange}
                label={`To confirm, type "${memberEmail}" in the box below`}
              />
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            {t('actions.cancel')}
          </Button>
          <Button
            variant="contained"
            disabled={loading || !isValid}
            onClick={handleTransferOwnership}
          >
            {loading && (
              <CircularProgress size={22} sx={{ color: blue[500], mr: 2 }} />
            )}{" "}
            {t('actions.assign')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TransferOwnership;
