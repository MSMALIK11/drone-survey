import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../shared/BackButton";
import api from "../services";
import Loading from "../shared/Loading";
import Details from "../components/ProjectDetails/Details";
import { useQuery } from "react-query";
import UserList from "../components/ProjectDetails/UserList";
import DetailsHeader from "../components/ProjectDetails/DetailsHeader";
import Map from "../components/ProjectDetails/Map";
import Wrapper from "../components/Wrapper";
import { useTranslation } from 'react-i18next';
import { resetProjectDetails, setProjectDetails } from "../store/projectDetails";
import { useDispatch, useSelector } from "react-redux";
const ProjectDetails = () => {
  const parmas = useParams();
  const { id } = parmas;
  const auth = JSON.parse(localStorage.getItem("auth-user"));
  const [placeName, setPlaceName] = useState("");
  const navigate = useNavigate();
  const dispatch=useDispatch()
  // const project=useSelector((state)=>state.projectDetails.data)
  const { t } = useTranslation();
  const { isLoading,data, isError } = useQuery(["getProjectDetails"], () =>
    api.dashboardApi.getProjectDetailsById(id, auth.email),
    // {
    //   staleTime: 0, // Data is considered stale immediately
    //   cacheTime: 0, // Data is removed from the cache after 0 milliseconds
    //   refetchOnMount: 'always', // Refetch data on every mount
    //   refetchOnWindowFocus: true, // Refetch data when window regains focus
    // }
  );
   useEffect(()=>{
    if(!isLoading){
      dispatch(setProjectDetails(data?.data))
    }
 },[data])
  if (isError) {
    navigate("/");
    return;
  }
  if (isLoading) return <Loading isVisible={true} />;

  const project = data && data.data;
  const getPlaceName = (name) => {
    setPlaceName(name);
  };
//  useEffect(()=>{
//   dispatch(setProjectDetails(data.data))
//  },[])
  return (
    <div>
      <header className="bg-black text-white h-[60px] flex items-center px-4 justify-between">
        <p>Project Details Dashboard </p>
        <BackButton path="/" label={"Back to project"} />
      </header>
      {project ? (
        <main id="project-details">
          <Wrapper>
            <div className="p-3 bg-white rounded-[10px]">
              <DetailsHeader />
              <div id="details-container-box" className="flex gap-4 ">
                <div>
                  <Details
                    project_name={project?.project_name}
                    category={project?.category}
                    description={project?.description}
                    trashed_time={project?.trashed_time}
                    created_at={project?.created_at}
                    updated_at={project?.updated_at}
                    status={project?.progress}
                    placeName={placeName}
                    active={project?.active}
                    name={project.name}
                  />
                  <div>
                    <Map
                      lat={project.latitude}
                      lng={project.longitude}
                      getPlaceName={getPlaceName}
                    />
                  </div>
                </div>
            
              <UserList />
              </div>

            </div>
          </Wrapper>
        </main>
      ) : (
        <div>Something went wrong please try again</div>
      )}
    </div>
  );
};

export default ProjectDetails;
