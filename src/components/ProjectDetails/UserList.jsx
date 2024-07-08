import React, { useState, useCallback, useMemo } from "react";
import { List, IconButton, Tooltip, Badge } from "@mui/material";
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
import { EDIT_USER, REMOVE_USER, TRANSFER_OWNERSHIP } from "../../constant/constant";
import FilterMenu from "./FilterMenu";
import { permissionOptionsList,analysisOptionsList } from "./data";
import Each from '../Each'


const UserList = () => {
  const [showTransferOwnershipModal, setShowTransferOwnership] =
    useState(false);
  const [showRemoveUserModal, setShowRemoveUserModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [memberEmail, setMemberEmail] = useState("");
  const [isEditMode,setIsEditMode]=useState(false)
  const [loading,setLoading]=useState(false)
  const [newUser, setNewUser] = useState({
    new_member_email: "",
    upload_permission: "",
    analysis_permission: "",
    report_permission: "",
  });
  const toast = useToast();
  const open = Boolean(anchorEl);

  const handleClick = useCallback((event, val) => {
    setMemberEmail(val);
    setAnchorEl(event.currentTarget);
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
      { name: "Mr Shoaib", email: "mohd.shoaib@botlabdynamics.com" },
      { name: "John Vick", email: "john@gmail.com" },
      { name: "Willium", email: "willium@gmail.com" },
      { name: "Jack Sparrow", email: "jackluim@jack.com" },
      { name: "Jack Sparrow", email: "jackluim@jack.com" },
      { name: "Jack Sparrow", email: "jackluim@jack.com" },
      { name: "Jack Sparrow", email: "jackluim@jack.com" },
      { name: "Jack Sparrow", email: "jackluim@jack.com" },
      { name: "Jack Sparrow", email: "jackluim@jack.com" },
      { name: "Jack Sparrow", email: "jackluim@jack.com" },
      { name: "Jack Sparrow", email: "jackluim@jack.com" },
      { name: "Jack Sparrow", email: "jackluim@jack.com" },
      { name: "Jack Sparrow", email: "jackluim@jack.com" },

    ],
    []
  );

  const handlePermissionChange = (val,name) => {
  
    setNewUser((prev) => ({
      ...prev,
      [name]: val,
    }));
  };
  // Add New  user to project
  const handleAddUserSubmit = async () => {
    setLoading(true)
    try {
     
      const res = await api.user.addUpdateUser(newUser);
      if (res.status === 201) {
        setShowAddUserModal(false);
        setLoading(false)
        setIsEditMode(false)
      }
    } catch (error) {
      console.error("Error::while calling add new user api", error);
      const message = errorHandler(error);
      toast(message, "error");
      setIsEditMode(false)
      setShowAddUserModal(false);
      setLoading(false)
    }
  };
  const handleEditUser=()=>{
    setIsEditMode(true)
    setShowAddUserModal(true)
    handleClose();

  }
const onMenuItemClick=(value)=>{
  switch(value){
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
}
const onFilterMenuItemClick=()=>{

}
  return (
    <div className="shadow-lg  border h-[80vh] border-softgray overflow-hidden rounded-lg !w-[400px] ">
      <div className="flex h-[66px]  px-3 items-center justify-between" >
        <h1>Users List</h1>
        <div className="flex items-center">
          <Tooltip title="Add new user" arrow>
            <IconButton onClick={() => setShowAddUserModal(true)}>
              <AddCircleOutlineIcon />
            </IconButton>
          </Tooltip>
          <FilterMenu onItemClick={onFilterMenuItemClick} />
        </div>
      </div>
      <div className="h-[64vh] overflow-scroll">
        <List
          sx={{ width: "100%", maxWidth: "100%", bgcolor: "background.paper" }}
        >
          <Each of={data} render={(user,index)=> <UserListItem
              key={user.email}
              user={user}
              onMenuClick={handleClick}
              onMenuItemClick={onMenuItemClick}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              index={index}
            />} />
 
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
      <Modal
      title={isEditMode?"Update Permission":"Add new user"}
        isOpen={showAddUserModal}
        submitText={isEditMode?"Update":"Add"}
        onClick={handleAddUserSubmit}
        onClose={() => setShowAddUserModal(false)}
         loading={loading}
      >
        <div className="w-[440px]">
          {
            !isEditMode && <InputControl label={"Email"} placeholder={"Enter email"} onChange={(event)=>handlePermissionChange(event.target.value,'new_member_email')} name="new_member_email" />
          }
          
          <div className="space-y-3 mt-4">
            <ComboBox
              label={"Upload Permission"}
              options={permissionOptionsList}
              name={"upload_permission"}
              onChange={handlePermissionChange}
            />
            <ComboBox
              label={"Analysis Permission"}
              options={analysisOptionsList}
              name={"analysis_permission"}
              onChange={handlePermissionChange}
            />
            <ComboBox
              label={"Report Permission"}
              options={permissionOptionsList}
              name={"report_permission"}
              onChange={handlePermissionChange}
            />

          </div>
        </div>
      </Modal>



      {/* Update User  */}
    </div>
  );
};

export default UserList;
