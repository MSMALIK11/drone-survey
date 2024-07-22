import React, { useState,useEffect } from "react";
import api from "../../services";
import { errorHandler } from "../../helper/handleError";
import useToast from "../../hooks/useToast";
import ConfirmationAlert from "../../shared//ConfirmationAlert";
import { useQueryClient } from "react-query";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
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
import CloseIcon from '@mui/icons-material/Close';
import Status from "./Status";
import ReadMoreReadLess from "../ui/ReadMoreReadLess";
import TextareaControl from "../ui/TextareaControl";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
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
  trashed_time,
  created_at,
  status,
  estimated_date,
  updated_at,
  placeName,
  active,
  name
}) => {
  const [showAlert, setShowAlert] = useState(false);
  const [showActivateAlert, setShowActivateAlert] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMessageCard, setShowMessageCard] = useState(false);
  const user=useSelector((state)=>state.projectDetails.permissions)
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
      if (res.status == 204) {
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
      if (res.status == 201) {
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

  const handleShowActivateConfirm = () => {
    setShowActivateAlert(true);
  };
  const onShowDeactivateAlert = () => {
    setShowAlert(true);
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
      if (res.status == 201) {
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
    setProject((prev) => ({ ...prev, [name]: value }));
  };
  useEffect(() => {
    if (!active) {
      setShowMessageCard(true);
      const timer = setTimeout(() => {
        setShowMessageCard(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [active]);
 
  const DetailRow = ({ label, value, extraClasses = "" }) => (
    <div
      className={`text-md flex  min-h-[40px]  items-center   min-w-[320px]    ${extraClasses}`}
    >
      <p className="w-[300px]">{label}:</p>
      <div>
        <span className="text-background text-md">{value}</span>
      </div>
    </div>
  );
  const DateRow = ({ label, date }) => (
    <p className="text-md mt-4 flex flex-col gap-2">
      {label}:
      <span className="bg-[#e3e3e1] shadow-sm border border-softgray min-w-[274px] !text-background px-4 py-1 rounded-full flex gap-2 items-center">
        <AccessTimeIcon /> {formatDate(date)}
      </span>
    </p>
  );
  return (
    <div>
      <main className="relative">
      {showMessageCard && !active && (
    <div className="absolute top-0 left-0 right-0 bg-red-200 text-yellow-800 border border-red-500 rounded-md p-4 shadow-md z-10">
      <div className="flex items-center">
        <InfoIcon className="mr-2" />
        <p className="flex-1">
          {t("project.inactiveMessage")}
        </p>
        <IconButton onClick={()=>setShowMessageCard(false)}><CloseIcon /></IconButton>
      </div>
    </div>
  )}
        <div className="bg-customGray text-background shadow-lg  pb-6  min-h-[380px] !min-w-[600px]  w-[40vw] rounded-lg p-5 border border-softgray relative">
          <div>
            <p className="text-background text-lg mb-2">
              {t("project.projectDetails")}
            </p>
          </div>
          <hr />
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
          <hr />

          <DetailRow
            label="Created By"
            value={<span className=" text-background">{name}</span>}
          />
          <hr />
          <DetailRow label="Location" value={placeName} />
          <hr />
          <DetailRow
            label="Project Progress"
            value={status && <Status status={status} />}
          />
          <hr />
          <DetailRow
            label="Status"
            value={
            
                <p>
                  {active ? (
                    <Tooltip title="Project activate">

                    <span className="text-green-500">
                      <CheckCircleIcon className="text-green-400" /> Activate
                    </span>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Project deactivate">
                    <span className="flex gap-1 items-center text-red-400">
                      <BlockIcon />
                      Deactivate
                    </span>

                    </Tooltip>
                  )}
                </p>
              
            }
          />
          <hr />
          <div className="lg:flex gap-4 lg:space-x-5 ">
            <DateRow label="Created At" date={created_at} />
            <DateRow label="Updated At" date={updated_at} />
          </div>
          {
            user.userRole!=="user" &&
          
          <div className="absolute top-2 right-1 flex items-center gap-2">
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
}
        </div>
      </main>

      <Modal
        isOpen={showEditModal}
        title="Update project details"
        submitText={"Update"}
        onClose={() => setShowEditModal(false)}
        onClick={handleUpdateProjectDetails}
        loading={isLoading}
        // width={"600px"}
      >
        <div className="w-[440px] flex flex-col gap-3.5">
          <hr />
          <div className="">
            <TextareaControl
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
            name="progress"
            label={"Project progress :"}
            options={options}
            value={project.project_status || "default"}
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
          />
          <hr />
          <div className="flex flex-col gap-1">
            <label className="text-background text-md">Estimated Date :</label>
            <input
              type="date"
              className="!bg-white !border-2 !border-softgray"
              onChange={handleDateChange}
              name="estimated_date"
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
