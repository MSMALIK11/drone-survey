import React, { useState, useCallback, useMemo } from "react";
import { Checkbox } from "@mui/material";
import TransferOwnership from "./TransferOwnership";
import RemoveUser from "./RemoveUser";
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
} from "../../constant/constant";
import { permissionOptionsList, analysisOptionsList } from "./data";
import UsersTable from "./UsersTable";
import { useQuery, useQueryClient } from "react-query";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
const initialState = {
  new_member_email: ``,
  upload_permission: "read",
  analysis_permission: "",
  report_permission: "",
  new_member_name: "",
  admin_permission: false,
};
console.log(new  Date().getTime())

const UserList = () => {
  const [showTransferOwnershipModal, setShowTransferOwnership] =
    useState(false);
  const [showRemoveUserModal, setShowRemoveUserModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selected, setSelected] = useState([]);
  const [memberEmail, setMemberEmail] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newUser, setNewUser] = useState(initialState);
 
  const { t } = useTranslation();
  const toast = useToast();
  const open = Boolean(anchorEl);
  const queryClient = useQueryClient();
  const handleClick = useCallback(
    (event, user) => {
      event.preventDefault();
      const editData = {
        new_member_name: user?.name,
        new_member_email: user?.user_email,
        upload_permission: user?.is_uploader,
        analysis_permission: user?.is_analyzer,
        report_permission: user?.is_reporter,
        admin_permission: user?.is_admin || false,
      };
      setNewUser(editData);
      setMemberEmail(user.user_email);
      if (selected.length == 0) {
        setSelected([user.user_email]);
      }

      setAnchorEl(event.currentTarget);
    },
    [selected]
  );

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

  const handlePermissionChange = (val, name) => {
    setNewUser((prev) => ({
      ...prev,
      [name]: val,
    }));
  };
  const handleAddUserSubmit = async () => {
    setLoading(true);
    try {
      const res = await api.user.addUpdateUser(newUser);
      const isSuccess = res.status === 201;

      if (isSuccess) {
        const successMessage = isEditMode
          ? t("messages.userUpdatedSuccess")
          : t("messages.userAddedSuccess", "success");
        toast(successMessage, "success");
        queryClient.invalidateQueries(["getProjectUsersList"]);
        setIsEditMode(false);
      }
    } catch (error) {
      console.error("Error::while calling add new user api", error);
      const message = errorHandler(error);
      toast(message, "error");
    } finally {
      setLoading(false);
      setShowAddUserModal(false);
      setIsEditMode(false);
      setSelected([]);
      setNewUser(initialState);
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
    setNewUser((prev) => ({ ...prev, admin_permission: event.target.checked }));
  };
  const onFilterMenuItemClick = () => {};
  const isDisabledBtn = !newUser.new_member_email ? true : false;
  const handleSelection = (selection) => {
    setSelected(selection);
  };
  const handleCloseAddUerModal = () => {
    setIsEditMode(false);
    setNewUser(initialState);
    setShowAddUserModal(false);
  };
  const handleShowAddUserModal = () => {
    setShowAddUserModal(true);
    setNewUser(initialState);
  };

  const handleRemoveUser = async () => {
    setLoading(true);

    // If no user is selected, exit early
    if (selected.length === 0) {
      setLoading(false);
      return;
    }

    // Determine the payload based on the number of selected users
    const isMultipleUsers = selected.length > 1;
    const payload = isMultipleUsers
      ? { member_emails: selected }
      : { member_email: selected[0] };

    try {
      const res = isMultipleUsers
        ? await api.user.removeMultipleProjectUser(payload)
        : await api.user.removeUser(payload);
      if (res.status == 201) {
        const length = res?.data[0]?.delete_users_list?.length ?? 0;
        toast(
          t("messages.multipleUserDeleteSuccess", { count: length }),
          "success"
        );
        queryClient.invalidateQueries(["getProjectUsersList"]);
        onCloseRemoveUser();

        return;
      }
      if (res.status === 204) {
        queryClient.invalidateQueries(["getProjectUsersList"]);
        onCloseRemoveUser();
        toast(t("messages.deleteUserSuccess"), "success");
      }
    } catch (error) {
      const message = errorHandler(error);
      toast(message, "error");
      console.error("Error:: while calling remove user API", error);
    } finally {
      setLoading(false);
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
          onDeleteSelection={() => setShowRemoveUserModal(true)}
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
        loading={loading}
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
          <InputControl
            label={"Name"}
            placeholder={"Enter name"}
            onChange={(event) =>
              handlePermissionChange(event.target.value, "new_member_name")
            }
            value={newUser.new_member_name}
            name="new_member_name"
            primary
          />
          <hr className="mt-4" />
          <div className="flex items-end  relative mt-4">
            <div className="w-[340px]">
              <InputControl
                primary
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
                checked={newUser.admin_permission}
                onChange={handleIsAdminChange}
                name="admin_permission"
              />
              <label htmlFor="admin-permission">
                {t("label.adminPermission")}
              </label>
            </div>
          </div>
          <hr className="mt-4" />

          <div className="space-y-3 mt-4">
            <div className="flex items-center justify-between">
              <label className="text-md text-background">
                {t("label.uploadPermission")}
              </label>
              <div>
                <ComboBox
                  options={permissionOptionsList}
                  name={"upload_permission"}
                  onChange={handlePermissionChange}
                  disabled={newUser.admin_permission}
                  value={newUser.upload_permission || "read"}
                />
              </div>
            </div>
            <hr className="" />
            <div className="flex items-center justify-between">
              <label className="text-md text-background">
                {t("label.analysisPermission")}
              </label>
              <div>
                <ComboBox
                  options={analysisOptionsList}
                  name={"analysis_permission"}
                  onChange={handlePermissionChange}
                  disabled={newUser.admin_permission}
                  value={newUser.analysis_permission || "default"}
                />
              </div>
            </div>
            <hr />
            <div className="flex items-center justify-between">
              <label className="text-md text-background">
                Report Permission
              </label>
              <div>
                <ComboBox
                  options={permissionOptionsList}
                  name={"report_permission"}
                  onChange={handlePermissionChange}
                  disabled={newUser.admin_permission}
                  value={newUser.report_permission || "default"}
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
