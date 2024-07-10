import React, { useState, useCallback, useMemo } from "react";
import { List, IconButton, Tooltip, Badge, Checkbox, Button } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import TransferOwnership from "./TransferOwnership";
import RemoveUser from "./RemoveUser";
import UserListItem from "./UserListItem";
import Modal from "../../components/ui/Modal";
import InputControl from "../../components/ui/InputControl";
import api from "../../services";
import { errorHandler } from "../../helper/handleError";
import useToast from "../../hooks/useToast";
import ComboBox from "../../components/ui/CompoBox";
import {
  EDIT_USER,
  REMOVE_USER,
  TRANSFER_OWNERSHIP,
  USER_ADDED_SUCCESS 
} from "../../constant/constant";
import FilterMenu from "./FilterMenu";
import { permissionOptionsList, analysisOptionsList } from "./data";
import Each from "../Each";
const initialState={
    new_member_email: "",
    upload_permission: "basic",
    analysis_permission: "read",
    report_permission: "",
  }

const UserList = () => {
  const [showTransferOwnershipModal, setShowTransferOwnership] =
    useState(false);
  const [showRemoveUserModal, setShowRemoveUserModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [memberEmail, setMemberEmail] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newUser, setNewUser] = useState(initialState);
  const toast = useToast();
  const open = Boolean(anchorEl);

  const handleClick = useCallback((event, user) => {
    setMemberEmail(user.email);
    // setNewUser((prev)=>({...prev,...user,new_member_email:user.email}))
    setNewUser(user)
    setAnchorEl(event.currentTarget);
    console.log('newUser',newUser,user)
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleShowTransferOwnership = () => {
    setShowTransferOwnership(true);
    handleClose();
  };

  const handleShowRemoveUserModal = useCallback(() => {
    setShowRemoveUserModal(true);
    handleClose();
  }, [handleClose]);

  const onCloseTransferOwnership = useCallback(() => {
    setShowTransferOwnership(false);
    setMemberEmail("");
  }, []);

  const onCloseRemoveUser = useCallback(() => {
    setShowRemoveUserModal(false);
    setMemberEmail("");
  }, []);
  // PENDING  change to actual api response  data
  const data = useMemo(
    () => [
      { name: "Mr Shoaib", email: "mohd.shoaib@botlabdynamics.com",
      new_member_email: "john@gmail.com",
        upload_permission: "basic",
        analysis_permission: "read",
        isAdmin:false,
        report_permission: "write", },
      { name: "Mr Shoaib", email: "msm76441@gmail.com",
        new_member_email: "msm76441@gmail.com",
        upload_permission: "basic",
        analysis_permission: "read",
        isAdmin:false,
        report_permission: "write", },
     
    ],
    []
  );

  const handlePermissionChange = (val, name) => {
    setNewUser((prev) => ({
      ...prev,
      [name]: val,
    }));
  };
  // Add New  user to project
  const handleAddUserSubmit = async () => {
    setLoading(true);
    try {
      const res = await api.user.addUpdateUser(newUser);
      if (res.status === 201) {
        toast(USER_ADDED_SUCCESS ,'success')
        setShowAddUserModal(false);
        setLoading(false);
        setIsEditMode(false);
        setNewUser(initialState)
      }
    } catch (error) {
      console.error("Error::while calling add new user api", error);
      const message = errorHandler(error);
      toast(message, "error");
      setShowAddUserModal(false);
      setLoading(false);
      setIsEditMode(false);
      setNewUser(initialState)
    }
  };
  const handleEditUser = () => {
    setIsEditMode(true);
    setShowAddUserModal(true);
    handleClose();
  };
  const onMenuItemClick = (value) => {
    switch (value) {
      case TRANSFER_OWNERSHIP:
        handleShowTransferOwnership();
        break;
      case REMOVE_USER:
        handleShowRemoveUserModal();
        break;
      case EDIT_USER:
        handleEditUser();
        break;
    }
  };
  const handleIsAdminChange=(event)=>{
    setNewUser((prev)=>({...prev,isAdmin:event.target.checked}))
  }
  const onFilterMenuItemClick = () => {};
  const isDisabledBtn=!newUser.new_member_email?true:false
  
const handleCloseAddUerModal=()=>{
  setIsEditMode(false);
      setNewUser(initialState)
      setShowAddUserModal(false)
}
  return (
    <div
      id="usersListWrapper"
      className="shadow-lg  border   border-softgray overflow-hidden rounded-lg !w-[400px] "
    >
      <div className="flex h-[66px]  px-3 items-center justify-between">
        <h1>Users List</h1>
        <div className="flex items-center">
          <FilterMenu onItemClick={onFilterMenuItemClick} />
          <Tooltip title="Add new user" arrow>
            
            <Button sx={{fontSize:'14px',borderRadius:'25px'}}  variant="outlined" onClick={() => setShowAddUserModal(true)}>
              <AddCircleOutlineIcon fontSize="small" sx={{marginRight:'8px'}} />
              Add user
            </Button>
          </Tooltip>
        </div>
      </div>
      <div id="users-list" className=" overflow-scroll">
        <List
          sx={{ width: "100%", maxWidth: "100%", bgcolor: "background.paper" }}
        >
          <Each
            of={data}
            render={(user, index) => (
              <UserListItem
                key={user.email}
                user={user}
                onMenuClick={handleClick}
                onMenuItemClick={onMenuItemClick}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                index={index}
              />
            )}
          />
        </List>
      </div>

      <TransferOwnership
        memberEmail={memberEmail}
        isOpen={showTransferOwnershipModal}
        onClose={onCloseTransferOwnership}
      />
      <RemoveUser
        memberEmail={memberEmail}
        isOpen={showRemoveUserModal}
        onClose={onCloseRemoveUser}
      />

      {/* Edit user or permissions */}
      <Modal
        title={isEditMode ? "Update User" : "Add new user"}
        isOpen={showAddUserModal}
        submitText={isEditMode ? "Update" : "Add"}
        onClick={handleAddUserSubmit}
        onClose={handleCloseAddUerModal}
        loading={loading}
        width={"632px"}
        disabled={isDisabledBtn}
      >
        <div>
          <div className="flex items-end  relative">
            <div className="w-[340px]">
              <InputControl
              // error="Please enter a valid email"
                label={"Email"}
                placeholder={"Enter email"}
                onChange={(event) =>
                  handlePermissionChange(event.target.value, "new_member_email")
                }
                value={newUser.new_member_email}
                name="new_member_email"
              />
            </div>
            <div>
              <Checkbox checked={newUser.isAdmin} onChange={handleIsAdminChange} />
              <label htmlFor="admin-permission">Admin Permission</label>
            </div>
          </div>

          <div className="space-y-3 mt-4">
            <div className="flex items-center justify-between">
              <label className="text-md text-background">
                Upload Permission
              </label>
              <div>
              <ComboBox
                options={permissionOptionsList}
                name={"upload_permission"}
                onChange={handlePermissionChange}
                disabled={newUser.isAdmin}
              />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-md text-background">
              Analysis Permission
              </label>
             <div>
             <ComboBox
              options={analysisOptionsList}
              name={"analysis_permission"}
              onChange={handlePermissionChange}
              disabled={newUser.isAdmin}
            />
             </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-md text-background">
              Report Permission
              </label>
              <div>
              <ComboBox
              options={permissionOptionsList}
              name={"report_permission"}
              onChange={handlePermissionChange}
              disabled={newUser.isAdmin}
            />

              </div>
            </div>
            
           
          </div>
        </div>
      </Modal>

      {/* Update User  */}
    </div>
  );
};

export default UserList;
