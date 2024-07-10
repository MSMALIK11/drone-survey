import React, { useState } from "react";
import api from "../../services";
import { errorHandler } from "../../helper/handleError";
import useToast from "../../hooks/useToast";
import ConfirmationAlert from "../../shared//ConfirmationAlert";
import { useQueryClient } from "react-query";
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
import BlockIcon from '@mui/icons-material/Block';
import ComboBox from "../../components/ui/CompoBox";
import Status from "./Status";
import ReadMoreReadLess from "../ui/ReadMoreReadLess";
import TextareaControl from "../ui/TextareaControl";
const options = [
  { value: "INITIATED", label: "Initiated" },
  { value: "IN-PROGRESS", label: "In Progress" },
  { value: "ON-HOLD", label: "ON HOLD" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "COMPLETED", label: "Completed" },
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
  placeName
}) => {
  const [showAlert, setShowAlert] = useState(false);
  const [showActivateAlert, setShowActivateAlert] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [project, setProject] = useState({
    description: "",
    project_status: "INITIATED",
    estimated_date: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
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
  const handlePermissionChange = (value) => {
    setProject((prev) => ({ ...prev, ["project_status"]: value }));
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProject((prev) => ({ ...prev, [name]: value }));
  };
  const handleUpdateProjectDetails = async () => {
    setIsLoading(true);
    try {
      const res = await api.dashboardApi.updateProjectDetails(project);
      if (res.status == 201) {
        toast(PROJECT_UPDATED_SUCCESS_MESSAGE, "SUCCESS");
        queryClient.invalidateQueries(["getProjectDetails"]);
        setShowEditModal(false)
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error::while updating the project details");
      const errorMessage = errorHandler(error);
      toast(errorMessage, "error");
      setIsLoading(false);
      setShowEditModal(false)
    }
  };
  const handleShowEditDetailsModal=()=>{
    setShowEditModal(true)
    setProject({
      project_name,
      description,
      project_status:status,
      estimated_date
    })
  }
  const handleDateChange=(e)=>{
    const {value,name}=e.target
    setProject((prev) => ({ ...prev, [name]: value }));

  }

  const DetailRow = ({ label, value, extraClasses = '' }) => (
  <div className={`text-md flex  min-h-[44px]   flex items-center   min-w-[320px]    ${extraClasses}`}>
    <p className="w-[300px]">
      {label}:
    </p>
    <div> 
      <span className="text-background text-md">{value}</span>

    </div>

  </div>
  );
  const DateRow = ({ label, date }) => (
    <p className="text-md mt-4 flex flex-col gap-1 w-[264px]">
      {label}: 
      <span className="bg-blueTag !text-white px-4 py-1 rounded-full flex gap-2 items-center">
        <AccessTimeIcon /> {formatDate(date)}
      </span>
    </p>
  );
  return (
    <div>
     
      <main>
  <div className="bg-customGray  text-background shadow-lg  pb-6  min-h-[380px] rounded-lg p-5 border border-softgray relative">
    <div>
      <p className="text-background text-lg mb-2">Project Details</p>
    </div>
    <hr />
    <DetailRow label="Project Name" value={project_name} />
    <hr />
    <div className="flex">
      <p className="w-[300px]">Description</p>
      <p className="block min-h-[20px] max-h-[120px] overflow-y-auto flex-1 py-2"><ReadMoreReadLess description={description} /></p>
    </div>
    <hr />

    <DetailRow label="Category" value={
      <span className="bg-yellowTag text-background rounded-full px-4">
        {category}
      </span>
    }  />
    <hr />
    <DetailRow label="Location" value={placeName} />
    <hr />
    <DetailRow label="Status" value={status && <Status status={status} />} />
    <hr />
    <div className="flex gap-4 space-x-5 " >
      <DateRow label="Created At" date={created_at} />
      <DateRow label="Updated At" date={updated_at} />
    </div>
    <div className="absolute top-2 right-1 flex items-center gap-2">
      <Tooltip title="Edit details" arrow>
        {/* <IconButton disabled={!!trashed_time} onClick={handleShowEditDetailsModal}>
          <EditIcon />
        </IconButton> */}
        <Button  disabled={!!trashed_time} onClick={handleShowEditDetailsModal}  variant="outlined" sx={{borderRadius:'25px'}} className="flex items-center gap-2">
          <EditIcon />
       Edit
        </Button>
      </Tooltip>
 
    <Button 
    sx={{borderRadius:'25px'}}
    startIcon={<BlockIcon  />}
variant="contained"
     onClick={trashed_time ? handleShowActivateConfirm : onShowDeactivateAlert}>
    {trashed_time ? "Activate" : "Deactivate"}
    </Button>
    </div>
  </div>
</main>


      <Modal
        isOpen={showEditModal}
        title="Update project details"
        submitText={"Update"}
        onClose={() => setShowEditModal(false)}
        onClick={handleUpdateProjectDetails}
        loading={isLoading}

      >
        <div className="w-[440px] flex flex-col gap-4">
          <div className="">

          <TextareaControl
            value={project.description}
            label={"Description :"}
            name={"description"}
            onChange={handleInputChange}
            placeholder="Description"
          />
          </div>
          <ComboBox
            name="permission"
            label={"Status :"}
            options={options}
            value={project.project_status}
            selectedOption={project.project_status}
            onChange={handlePermissionChange}
          />
          <div className="flex flex-col gap-1">
          <label className="text-background">
            Estimate Time :
          </label>
          <input type="date" onChange={handleDateChange} name="estimated_date" />
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

export default ProjectDetails;
