import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import CircularProgress from "@mui/material/CircularProgress";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function ConfirmationAlert({open,message,onClose,onConfirm,isLoading}) {
  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="md"
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Confirmation
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers sx={{minHeight:'60px'}}>
          <Typography gutterBottom>
           {message}
          </Typography>
          
        </DialogContent>
        <DialogActions> 
          <Button size='small' sx={{borderRadius:'25px'}} autoFocus onClick={onClose} variant='outlined'>
            Cancel
          </Button>
          <Button size='small' sx={{borderRadius:'25px'}}  disabled={isLoading} variant='contained' autoFocus onClick={onConfirm} className='loginBtn'>
            {
              isLoading &&  <CircularProgress size={18}  />
            }
           
            Yes
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}
