import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../shared/BackButton";
import api from "../services";
import Loading from "../shared/Loading";
import Details from "../components/ProjectDetails/Details";
import { useQuery } from "react-query";
import UserList from "../components/ProjectDetails/UserList";
import DetailsHeader from "../components/ProjectDetails/DetailsHeader";
import Map from '../components/ProjectDetails/Map'
const ProjectDetails = () => {
  const parmas = useParams();
  const { id } = parmas;
  const auth = JSON.parse(localStorage.getItem("auth-user"));
  const navigate=useNavigate()
  console.log('id',id)
  const[placeName,setPlaceName]=useState("")
  const { isLoading, data,isError } = useQuery(["getProjectDetails"], () =>
    api.dashboardApi.getProjectDetailsById(id, auth.email)
  );

  if(isError){
    navigate('/')
    return
    
  }
  if (isLoading) return <Loading isVisible={true} />;

  const project = data && data.data;
  const getPlaceName=(name)=>{
    setPlaceName(name)
  }
  return (
    <div>
      <header className="bg-black text-white h-[50px] flex items-center px-4 justify-between">
        <p>Project Details Dashboard </p>
        <BackButton path="/" label={"Back to project"} />
      </header>
      {project ? (
        <main className="p-4">
          <DetailsHeader />
          <div className="flex gap-4 " >
<div className="flex-1 bg-green-40">
          <Details
            project_name={project?.project_name}
            category={project?.category}
            description={project?.description}
            trashed_time={project?.trashed_time}
            created_at={project.created_at}
            updated_at={project.updated_at}
            status={project.status}
            placeName={placeName}
          />
          <div >
          <Map lat={project.latitude} lng={project.longitude} getPlaceName={getPlaceName} />

          </div>
          

</div>

          <UserList />


          </div>

        </main>
      ) : (
        <div>Something went wrong please try again</div>
      )}
    </div>
  );
};

export default ProjectDetails;
