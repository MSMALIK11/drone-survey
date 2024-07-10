import {
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import React from "react";
import { formatName } from "../../helper/formatName";
import PersonIcon from '@mui/icons-material/Person';
import CachedIcon from '@mui/icons-material/Cached';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { TRANSFER_OWNERSHIP,REMOVE_USER,EDIT_USER } from "../../constant/constant";
const UserListItem = ({
  user,
  onMenuClick,onMenuItemClick,
  anchorEl,
  open,
  onClose,
  index
}) => (
<ListItem className={`border-t-2 border-b-2 border-list w-full h-[66px] ${index%2===0?"bg-white":"bg-list"}`} >
    <ListItemAvatar>
      <Avatar
        sx={{ bgcolor: "#303D78", width: 32, height: 32, fontSize: 14 }}
      >
        {formatName(user?.name)}
      </Avatar>
    </ListItemAvatar>
    <ListItemText primary={user.name} secondary={user.email} />
    <IconButton
      id="basic-button"
      aria-controls={open ? "basic-menu" : undefined}
      aria-haspopup="true"
      aria-expanded={open ? "true" : undefined}
      onClick={(e)=>onMenuClick(e,user)}
    >
      <MoreVertIcon />
    </IconButton>
    <Menu
      id="basic-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      MenuListProps={{ "aria-labelledby": "basic-button" }}
    >
      <MenuItem onClick={() => onMenuItemClick(TRANSFER_OWNERSHIP)}>
     <SyncAltIcon sx={{marginRight:'8px'}} /> Transfer Ownership
      </MenuItem>
      <MenuItem onClick={() => onMenuItemClick(EDIT_USER)}>
      <CachedIcon sx={{marginRight:'8px'}} /> Edit
      </MenuItem>
      <MenuItem onClick={() => onMenuItemClick(REMOVE_USER)}><PersonIcon sx={{marginRight:'8px'}} /> Remove User</MenuItem>
    </Menu>
  </ListItem>
);

export default UserListItem;
