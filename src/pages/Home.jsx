import React, { useEffect, useState, useRef } from "react";
import HomeDashbordHeader from "../components/HomeDashbordHeader";
import "../style/home.css";
import { Box } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import mapboxgl from "mapbox-gl";
import { useNavigate } from 'react-router-dom';
import api from '../services'
import { sortProjectsByDate } from "../helper/sortProjectsByDate";
import InputSearchControl from "../components/ui/InputSearchControl";
import Loading from "../shared/Loading";
import Wrapper from "../components/Wrapper";
const Home = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);
  const [lng, setLng] = useState(78.9629);
  const [lat, setLat] = useState(20.5937);
  const [zoom, setZoom] = useState(4);

  const [defaultLng, setDefaultLng] = useState(78.9629);
  const [defaultLat, setDefaultLat] = useState(20.5937);
  const [expandedProject, setExpandedProject] = useState(null);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState([defaultLng, defaultLat]);

  const [selectedValue, setSelectedValue] = useState("0");
  const navigate = useNavigate()


  const fetchProjects = async () => {
    // startTokenRefreshInterval()
    

    try {

      const response = await api.dashboardApi.getAllProjectstList()
    
      if (response.status===200) {
        const data= sortProjectsByDate(response?.data,1)
        console.log("data", data)
        if(Array.isArray(data)){
          
          setFilteredProjects(data);
          setProjects(data);

        }
        setLoading(false);
      } 
    } catch (error) {
      console.log("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoicmF3YXRhbW1pZSIsImEiOiJjbG5rNzgzN28wandvMnFwMm1qbWduZ25hIn0.zjWDLv9gL6YI1uIIwPgA7A";

    const initialLng = isNaN(lng) ? defaultLng : lng;
    const initialLat = isNaN(lat) ? defaultLat : lat;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: mapCenter,
      zoom: zoom,
    });

    const zoomControls = new mapboxgl.NavigationControl();
    map.current.addControl(zoomControls, "top-right");

    return () => {
      markers.current.forEach((marker) => marker.remove());
      map.current.remove();
    };
  }, [lng, lat, zoom, defaultLng, defaultLat, mapCenter]);

  const mapContainerStyle = {
    position: "relative",
    top: "0%",
    bottom: "0%",
    width: "90%",
    height: `calc(100vh - 160px)`,
    borderRadius: "20px",
    marginLeft: "10px",
    marginTop: "-10px",
  };

const handleChange = (event) => {
  const value = Number(event.target.value);
  console.log('value change sort',value)
  setSelectedValue(value);
  let sortedProjects=sortProjectsByDate(projects,value)

  console.log('sortedProjects:', sortedProjects)

  setFilteredProjects(sortedProjects);
};
  
  
  const handleSearch = (event) => {
    const searchTerm = event.target.value;
    const filteredProjects = projects.filter(
      (project) =>
        project?.project_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project?.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredProjects(filteredProjects);
  };

 
  const handleCategorySearch = (event) => {
    const category = event.target.value;

    const filteredProjectsByCategory = projects.filter(
      (project) => project.category.toLowerCase().includes(category.toLowerCase())
    );

    setFilteredProjects(filteredProjectsByCategory);
  };

  const handleMouseEnter = (projectId, lat, lng) => {


    const markerLng = isNaN(lng) ? defaultLng : lng;
    const markerLat = isNaN(lat) ? defaultLat : lat;

    // Create a new marker object
    const newMarker = new mapboxgl.Marker({ color: "blue" })
      .setLngLat([markerLng, markerLat])
      .addTo(map.current);

    markers.current.push(newMarker);
    map.current.flyTo({
      center: [markerLng, markerLat],
      essential: true,
    });
  };

  const handleMouseLeave = () => {
    setExpandedProject(null);
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];
  };
  const  handleProjectCardClick=(id)=>{
    navigate(`/project/${id}/details`)
  }
  return (
    <>
      <HomeDashbordHeader />
      <Wrapper>
      <Box>
        <Box className="outer_header mr-9 pb-2">
          <Box className="flex gap-4">
          <InputSearchControl handleSearch={handleSearch} hintText={"Search project by name"} />
          <InputSearchControl handleSearch={handleCategorySearch} hintText={"Search project by category"} />
        
          </Box>

          <Box className="outer_right">
            <Box className="combo_value"></Box>
            <FormControl  >
              <Select 
               size="small"
               id="demo-simple-select"
               value={selectedValue}
               onChange={handleChange}
               sx={{borderRadius:'25px',fontSize:'14px'}}
              >
                <MenuItem value="1">  
                </MenuItem>
                <MenuItem value="0">Sort By Asc Date</MenuItem>
                <MenuItem value="1">Sort By Desc Date</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Box className="h-full">
          <Grid container spacing={1}>
            <Grid item xs={12} md={6} lg={5} mt={0} className="card-content">
              <div className="flex w-full flex-col gap-4 bg-white p-4">
                {
                   filteredProjects?.length === 0 ? (
                    <h3 style={{ marginTop: "10rem" }} className="font-semibold text-gray-400">
                      No projects available for this name or category.
                    </h3>
                  ): filteredProjects?.map((project, index) => (
                    <div
                      className={`card `}
                      onMouseEnter={() =>
                        handleMouseEnter(
                          project.project_id,
                          project.latitude,
                          project.longitude
                        )
                      }
                      onMouseLeave={handleMouseLeave}
                      key={index}
                      onClick={()=>handleProjectCardClick(project?.project_id)}
                  
                    >
                      <div className="card-content-wrapper">
                        <p><span className="text-white">Project Name : </span>{project.project_name}</p>
                        <p><span className="text-white">Project Category :</span> {project.category}</p>
                      </div>
                    </div> 
                  ))

                }
              </div>
            </Grid>

            <Grid xs={12} md={6} lg={7} style={{marginTop:"12px"}}>
              <Box
                className="header_map"
                style={{ height: "h-auto", width: "98%" }}>
                <div style={mapContainerStyle} ref={mapContainer} />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
      </Wrapper>
      <Loading isVisible={loading} />
    </>
  );
};

export default Home;
