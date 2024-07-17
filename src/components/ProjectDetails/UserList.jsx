import React, { useState, useCallback, useMemo } from "react";
import {
  List,
  IconButton,
  Tooltip,
  Badge,
  Checkbox,
  Button,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import TransferOwnership from "./TransferOwnership";
import RemoveUser from "./RemoveUser";
import UserListItem from "./UsersTable";
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
  USER_ADDED_SUCCESS,
} from "../../constant/constant";
import { permissionOptionsList, analysisOptionsList } from "./data";
import UsersTable from "./UsersTable";
import { useQuery } from "react-query";
const initialState = {
  new_member_email: "",
  upload_permission: "",
  analysis_permission: "",
  report_permission: "",
  new_member_name:"",
  admin_permission:false
};

const UserList = () => {
  const [showTransferOwnershipModal, setShowTransferOwnership] =
    useState(false);
  const [showRemoveUserModal, setShowRemoveUserModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selected,setSelected]=useState([])
  const [memberEmail, setMemberEmail] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newUser, setNewUser] = useState(initialState);
  const toast = useToast();
  const open = Boolean(anchorEl);

  const handleClick = useCallback((event, user) => {
    event.preventDefault();
    setMemberEmail(user.user_email
    );
    if(selected.length==0){
      setSelected([user.user_email])

    }
    setNewUser(user);
    setAnchorEl(event.currentTarget);
  }, [selected]);

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
  // const data = useMemo(
  //   () => [
  //     {id:new Date(), name: "John", email: "john@mail.com",
  //     new_member_email: "john@gmail.com",
  //       upload_permission: "basic",
  //       analysis_permission: "read",
  //       isAdmin:true,
  //       report_permission: "write",
  //       type:"admin"
  //      },
  //     {id:new Date(), name: "Jack", email: "jack@gmail.com",
  //       new_member_email: "jack@gmail.com",
  //       upload_permission: "basic",
  //       analysis_permission: "read",
  //       isAdmin:false,
  //       type:"Member",
  //       report_permission: "write", },
  //     {id:new Date(), name: "Jack", email: "jack@gmail.com",
  //       new_member_email: "jack@gmail.com",
  //       upload_permission: "basic",
  //       analysis_permission: "read",
  //       isAdmin:false,
  //       type:"Member",
  //       report_permission: "write", }

  //   ],
  //   []
  // );

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
        toast(USER_ADDED_SUCCESS, "success");
        setShowAddUserModal(false);
        setLoading(false);
        setIsEditMode(false);
        setNewUser(initialState);
      }
    } catch (error) {
      console.error("Error::while calling add new user api", error);
      const message = errorHandler(error);
      toast(message, "error");
      // setShowAddUserModal(false);
      // setLoading(false);
      // setIsEditMode(false);
      // setNewUser(initialState);
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
  const handleIsAdminChange = (event) => {
    setNewUser((prev) => ({ ...prev, isAdmin: event.target.checked }));
  };
  const onFilterMenuItemClick = () => {};
  const isDisabledBtn = !newUser.new_member_email ? true : false;
const handleSelection=(selection)=>{
  setSelected(selection)
}
  const handleCloseAddUerModal = () => {
    setIsEditMode(false);
    setNewUser(initialState);
    setShowAddUserModal(false);
  };
  const handleShowAddUserModal = () => {
    setShowAddUserModal(true);
  };

  const handleRemoveUser = async () => {
    setLoading(true);
    const payload = {
      member_emails:selected.length>0 ?selected:[selected[0]],
    };
    try {
      const res = await api.user.removeUser(payload);
      console.log('red',res)
      setLoading(false);
      onCloseRemoveUser();
    } catch (error) {
      setLoading(false);
      const message = errorHandler(error);
      toast(message, "error");
      onCloseRemoveUser();
      console.error("Error:: while calling transfer ownership api", error);
    }
  };
  return (
    <div
      id="usersListWrapper"
      className="shadow-lg  border flex-1  border-softgray  overflow-hidden rounded-lg min-w-[542px] "
    >
      <div id="users-list">
        <UsersTable
          key="users-list-table"
          onMenuClick={handleClick}
          onMenuItemClick={onMenuItemClick}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          onAddClick={handleShowAddUserModal}
          handleSelection={handleSelection}
          onDeleteSelection={()=>setShowRemoveUserModal(true)}
        />
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
        delUsersList={selected}
        handleRemoveUser={handleRemoveUser}
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
              <Checkbox
                checked={newUser.isAdmin}
                onChange={handleIsAdminChange}
                name="admin_permission"
              />
              <label htmlFor="admin-permission">Admin Permission</label>
            </div>
          </div>
          <InputControl
                label={"Name"}
                placeholder={"Enter name"}
                onChange={(event) =>
                  handlePermissionChange(event.target.value, "new_member_name")
                }
                value={newUser.new_member_name}
                name="new_member_name"
              />

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
                  value={"default"}
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
                  value={"default"}
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
                  value={"default"}
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
