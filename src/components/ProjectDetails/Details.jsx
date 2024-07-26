import React, { useState, useEffect } from "react";
import api from "../../services";
import { errorHandler } from "../../helper/handleError";
import useToast from "../../hooks/useToast";
import ConfirmationAlert from "../../shared//ConfirmationAlert";
import { useQueryClient } from "react-query";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {
  CONFIRMATION_MESAGE,
  PROJECT_DACTIVATION_SUCCESS,
  ACTIVATE_CONFIRMATION_MESAGE,
  PROJECT_ACTIVATION_SUCCESS,
  PROJECT_UPDATED_SUCCESS_MESSAGE,
} from "../../constant/constant";
import { formatDate } from "../../helper/formateDate";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Button, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Modal from "../ui/Modal";
import BlockIcon from "@mui/icons-material/Block";
import InfoIcon from "@mui/icons-material/Info";
import ComboBox from "../../components/ui/CompoBox";
import CloseIcon from "@mui/icons-material/Close";
import ReadMoreReadLess from "../ui/ReadMoreReadLess";
import TextareaControl from "../ui/TextareaControl";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { changeDateType } from "../../helper/changeDateType";
const options = [
  { value: "INITIATED", label: "Initiated" },
  { value: "IN-PROGRESS", label: "In progress" },
  { value: "ON-HOLD", label: "ON Hold" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "COMPLETED", label: "Completed" },
];
const activeOptions = [
  {
    label: "Activate",
    value: true,
  },
  {
    label: "Deactivate",
    value: false,
  },
];

const ProjectDetails = ({
  project_name,
  category,
  description = "",
  created_at,
  status,
  estimated_date,
  updated_at,
  placeName,
  active,
  name,
}) => {
  const [showAlert, setShowAlert] = useState(false);
  const [showActivateAlert, setShowActivateAlert] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMessageCard, setShowMessageCard] = useState(false);
  const user = useSelector((state) => state.projectDetails.permissions);
  const [minDate, setMinDate] = useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (event) => {
    console.log("ecent", event);
    setAnchorEl(null);
  };
  const [project, setProject] = useState({
    description: "",
    progress: "INITIATED",
    active: false,
    estimated_date: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const handleDeactivateConfirm = async () => {
    setIsLoading(true);
    try {
      const res = await api.user.deactiveProject();
      if (res.status === 204) {
        setIsLoading(false);
        setShowAlert(false);
        toast(PROJECT_DACTIVATION_SUCCESS, "success");
        queryClient.invalidateQueries(["getProjectDetails"]);
      }
    } catch (error) {
      setIsLoading(false);
      setShowAlert(false);
      console.error("Error::while deactivating project", error);
      const message = errorHandler(error);
      toast(message, "error");
    }
  };
  const handleActivateConfirm = async () => {
    setIsLoading(true);

    try {
      const res = await api.user.activeProject();
      if (res.status === 201) {
        setIsLoading(false);
        setShowActivateAlert(false);
        toast(PROJECT_ACTIVATION_SUCCESS, "success");
        queryClient.invalidateQueries(["getProjectDetails"]);
      }
    } catch (error) {
      setShowActivateAlert(false);
      setIsLoading(false);
      console.error("Error::while deactivating project", error);
      const message = errorHandler(error);
      toast(message, "error");
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };
  const handlePermissionChange = (value, name) => {
    setProject((prev) => ({ ...prev, [name]: value }));
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProject((prev) => ({ ...prev, [name]: value }));
  };
  const handleUpdateProjectDetails = async () => {
    setIsLoading(true);
    try {
      const payload = JSON.stringify(project);
      const res = await api.dashboardApi.updateProjectDetails(payload);
      if (res.status === 201) {
        toast(PROJECT_UPDATED_SUCCESS_MESSAGE, "SUCCESS");
        queryClient.invalidateQueries(["getProjectDetails"]);
        setShowEditModal(false);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error::while updating the project details");
      const errorMessage = errorHandler(error);
      toast(errorMessage, "error");
      setIsLoading(false);
      setShowEditModal(false);
    }
  };
  const handleShowEditDetailsModal = () => {
    setShowEditModal(true);
    setProject({
      project_name,
      description,
      project_status: status,
      active,
      progress: "",
      estimated_date: estimated_date || "",
    });
  };
  const handleDateChange = (e) => {
    const { value, name } = e.target;
    const date = changeDateType(value);
    setProject((prev) => ({ ...prev, [name]: date }));
  };
  useEffect(() => {
    const getTodayDate = () => {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based
      const dd = String(today.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    };

    setMinDate(getTodayDate());
    if (!active) {
      setShowMessageCard(true);
      const timer = setTimeout(() => {
        setShowMessageCard(false);
      }, 7000);

      return () => clearTimeout(timer);
    }
  }, [active]);

  const DetailRow = ({ label, value, extraClasses = "" }) => (
    <div
      className={`text-md flex  min-h-[44px]  items-center   min-w-[320px]    ${extraClasses}`}
    >
      <p className="w-[300px]">{label}:</p>
      <div>
        <span className="text-background text-md">{value}</span>
      </div>
    </div>
  );
  const DateRow = ({ label, date, normal }) => (
    <p className="text-md mt-4 flex flex-col gap-1">
      {label}:
      <span className="bg-[#e3e3e1] shadow-sm border border-softgray inline-flex !text-background px-4 py-1 rounded-full  gap-1 items-center">
        <AccessTimeIcon /> {normal ? date : formatDate(date)}
      </span>
    </p>
  );
  const handleItemClick = async (value) => {
    const data = {
      project_name,
      description,
      project_status: status,
      active,
      progress: value,
      estimated_date: estimated_date || "",
    };
    setIsLoading(true);
    try {
      const payload = JSON.stringify(data);
      const res = await api.dashboardApi.updateProjectDetails(payload);
      if (res.status === 201) {
        toast(t("messages.projectStatusUpdate"), "SUCCESS");
        queryClient.invalidateQueries(["getProjectDetails"]);
        setShowEditModal(false);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error::while updating the project details");
      const errorMessage = errorHandler(error);
      toast(errorMessage, "error");
      setIsLoading(false);
      setShowEditModal(false);
    }
    handleClose();
  };

  function changeDateFormat(dateStr) {
    // Split the input date string by hyphens
    const [day, month, year] = dateStr.split("-");

    // Rearrange the parts into the desired format and return
    return `${year}-${month}-${day}`;
  }
  return (
    <div>
      <main className="relative ">
        {showMessageCard && !active && (
          <div className="absolute top-0 left-0 right-0 bg-red-200 text-yellow-800 border border-red-500 rounded-md p-4 shadow-md z-10">
            <div className="flex items-center">
              <InfoIcon className="mr-2" />
              <p className="flex-1 whitespace-nowrap">
                {user.userRole === "admin" || user.userRole === "owner"
                  ? t("project.inactiveMessage")
                  : t("project.inactiveUserMessage")}
              </p>
              <IconButton onClick={() => setShowMessageCard(false)}>
                <CloseIcon />
              </IconButton>
            </div>
          </div>
        )}
        <div className="lg:bg-customGray  text-background shadow-lg  min-h-[380px]   w-[40vw] min-w-[440px] rounded-lg p-[22px] border border-softgray relative">
          <div className="flex justify-between items-center">
            <p className="text-background text-lg">
              {t("project.projectDetails")}
            </p>
            {user.userRole !== "user" && (
              <div>
                <Tooltip title="Edit details" arrow>
                  <Button
                    onClick={handleShowEditDetailsModal}
                    variant="outlined"
                    sx={{ borderRadius: "25px" }}
                    className="flex items-center gap-2"
                  >
                    <EditIcon />
                    Edit
                  </Button>
                </Tooltip>
              </div>
            )}
          </div>
          <hr className="mt-2" />
          <DetailRow label="Project Name" value={project_name} />
          <hr />
          <div className="flex min-h-[44px] items-center">
            <p className="w-[300px]">Description</p>
            <p className="block min-h-[20px] max-h-[120px] overflow-y-auto flex-1 py-2">
              <ReadMoreReadLess description={description} />
            </p>
          </div>
          <hr />

          <DetailRow
            label="Category"
            value={<span className=" text-background">{category}</span>}
          />
          <hr />

          <DetailRow
            label="Owner Email"
            value={<span className=" text-background">{name}</span>}
          />
          <hr />
          <DetailRow label="Location" value={placeName} />
          <hr />

          <div className="flex items-center">
            <label className="w-[300px] block">Project Progress</label>
            <div className="flex gap-1 items-center">
              <span>{status}</span>
              <Tooltip title="Change progress status">
                <IconButton
                  disabled={!active}
                  id="fade-button"
                  aria-controls={open ? "fade-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                >
                  <ArrowDropDownIcon fontSize="large" />
                </IconButton>
              </Tooltip>
            </div>
            <Menu
              id="fade-menu"
              MenuListProps={{
                "aria-labelledby": "fade-button",
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              TransitionComponent={Fade}
            >
              {options.map((option) => (
                <MenuItem onClick={() => handleItemClick(option.value)}>
                  {option.label}
                </MenuItem>
              ))}
            </Menu>
          </div>
          <hr />
          <DetailRow
            label="Status"
            value={
              <p>
                {active ? (
                  <Tooltip title="Project activate">
                    <span className="text-green-500">
                      <CheckCircleIcon className="text-green-400" />{" "}
                      {t("label.activated")}
                    </span>
                  </Tooltip>
                ) : (
                  <Tooltip title="Project deactivate">
                    <span className="flex gap-1 items-center text-red-400">
                      <BlockIcon />
                      {t("label.deactivated")}
                    </span>
                  </Tooltip>
                )}
              </p>
            }
          />
          <hr />
          <div className="lg:flex xs:flex-wrap gap-4 lg:space-x-5 ">
            <DateRow label={t("project.createdAt")} date={created_at} />
            <DateRow label={t("project.updatedAt")} date={updated_at} />
            {estimated_date && (
              <DateRow
                label="Estimated Date"
                date={estimated_date}
                normal={true}
              />
            )}
          </div>
        </div>
      </main>
      {/* Update Project details */}
      <Modal
        isOpen={showEditModal}
        title="Update project details"
        submitText={"Update"}
        onClose={() => setShowEditModal(false)}
        onClick={handleUpdateProjectDetails}
        loading={isLoading}
        width={"560px"}
      >
        <div className=" flex flex-col gap-3.5">
          <hr />
          <div className="">
            <TextareaControl
              disabled={!project.active}
              value={project.description}
              label={"Description :"}
              name={"description"}
              onChange={handleInputChange}
              placeholder="Description"
              primary
            />
          </div>
          <hr />
          <ComboBox
            disabled={!project.active}
            name="progress"
            label={"Project progress :"}
            options={options}
            value={project.project_status || ""}
            selectedOption={project.project_status}
            onChange={handlePermissionChange}
          />
          <hr />
          {/* Project activate deactivate */}
          <ComboBox
            name="active"
            label={"Status :"}
            options={activeOptions}
            value={project.active}
            onChange={handlePermissionChange}
            isDefaultVisible={false}
          />
          <hr />
          <div className="flex flex-col gap-1">
            <label className="text-background text-md">Estimated Date :</label>
            <input
              type="date"
              className="!bg-white !border-2 !border-softgray"
              onChange={handleDateChange}
              name="estimated_date"
              disabled={!project.active}
              min={minDate}
              value={changeDateFormat(project?.estimated_date)}
            />
          </div>
        </div>
      </Modal>

      <ConfirmationAlert
        isLoading={isLoading}
        message={CONFIRMATION_MESAGE}
        open={showAlert}
        onClose={handleCloseAlert}
        onConfirm={handleDeactivateConfirm}
      />
      <ConfirmationAlert
        isLoading={isLoading}
        message={ACTIVATE_CONFIRMATION_MESAGE}
        open={showActivateAlert}
        onClose={() => setShowActivateAlert(false)}
        onConfirm={handleActivateConfirm}
      />
    </div>
  );
};

export default React.memo(ProjectDetails);
