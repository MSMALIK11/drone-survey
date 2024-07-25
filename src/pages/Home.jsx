import React, { useEffect, useState, useRef } from "react";
import HomeDashbordHeader from "../components/HomeDashbordHeader";
import "../style/home.css";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import mapboxgl from "mapbox-gl";
import { useNavigate } from "react-router-dom";
import api from "../services";
import { sortProjectsByDate } from "../helper/sortProjectsByDate";
import InputSearchControl from "../components/ui/InputSearchControl";
import Loading from "../shared/Loading";
import Wrapper from "../components/Wrapper";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { resetProjectDetails } from "../store/projectDetails";
import CompoBox from "../components/ui/CompoBox";
import { getGeolocation } from "../helper/getGeolocation";
const Home = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);
  const [lng] = useState(78.9629);
  const [lat] = useState(20.5937);
  const [zoom] = useState(4);

  const [defaultLng] = useState(78.9629);
  const [defaultLat] = useState(20.5937);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState("");
  const [mapCenter] = useState([defaultLng, defaultLat]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchProjects = async () => {
    try {
      const response = await api.dashboardApi.getAllProjectstList();

      if (response.status === 200) {
        const data = sortProjectsByDate(response?.data, 1);
        if (Array.isArray(data)) {
          setFilteredProjects(data);
          setProjects(data);
        }
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    dispatch(resetProjectDetails());
  }, [dispatch]);
  const getPlacename = async (lat, lng) => {
    const placeName = await getGeolocation(lat, lng);
    setLocation(placeName);
  };

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoicmF3YXRhbW1pZSIsImEiOiJjbG5rNzgzN28wandvMnFwMm1qbWduZ25hIn0.zjWDLv9gL6YI1uIIwPgA7A";

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
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
    width: "100%",
    height: `calc(100vh - 160px)`,
    borderRadius: "20px",
    marginLeft: "10px",
    marginTop: "-10px",
  };

  const handleSearch = (event) => {
    const searchTerm = event.target.value;
    const filteredProjects = projects.filter(
      (project) =>
        project?.project_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        project?.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredProjects(filteredProjects);
  };

  const handleCategorySearch = (event) => {
    const category = event.target.value;

    const filteredProjectsByCategory = projects.filter((project) =>
      project.category.toLowerCase().includes(category.toLowerCase())
    );

    setFilteredProjects(filteredProjectsByCategory);
  };

  const handleMouseEnter = (projectId, lat, lng) => {
    const markerLng = isNaN(lng) ? defaultLng : lng;
    const markerLat = isNaN(lat) ? defaultLat : lat;
    getPlacename(lat, lng);
    // Create a new marker object
    const newMarker = new mapboxgl.Marker({ color: "blue" })
      .setLngLat([markerLng, markerLat])
      .addTo(map.current);

    markers.current.push(newMarker);
    map.current.flyTo({
      center: [markerLng, markerLat],
      essential: true,
      zoom: 17,
    });
  };

  const handleMouseLeave = () => {
    // markers.current.forEach((marker) => marker.remove());
    map.current.flyTo({
      center: mapCenter, // Center it back to the default or any desired coordinates
      zoom: 4, // Set the zoom level to 4
      essential: true,
    });
    setLocation("");
  };
  const handleProjectCardClick = (id) => {
    navigate(`/project/${id}/details`);
  };
  useEffect(() => {
    Cookies.remove("project", {
      path: "/",
      domain: "4h4k6l4naxdt4cgtcepmxtqave0cbmdw.lambda-url.ap-south-1.on.aws",
    });
    if (map.current) {
      markers.current.forEach((marker) => marker.remove());
      markers.current = [];
      projects.forEach((project) => {
        if (project.latitude && project.longitude) {
          const marker = new mapboxgl.Marker({ color: "blue" })
            .setLngLat([project.longitude, project.latitude])
            .addTo(map.current);
          markers.current.push(marker);
        }
      });
    }
  }, [projects]);
  const sortList = [
    {
      label: "Asc",
      value: 1,
    },
    {
      label: "Desc",
      value: 0,
    },
  ];
  const handleSortProject = (value) => {
    let sortedProjects = sortProjectsByDate(projects, value);
    setFilteredProjects(sortedProjects);
  };
  return (
    <>
      <HomeDashbordHeader />
      <Wrapper>
        <Box>
          <Box className="outer_header mr-9 pb-2">
            <Box className="flex gap-4">
              <InputSearchControl
                handleSearch={handleSearch}
                hintText={"Search project by name"}
              />
              <InputSearchControl
                handleSearch={handleCategorySearch}
                hintText={"Search project by category"}
              />
              <div>
                <CompoBox
                  onChange={handleSortProject}
                  options={sortList}
                  value={1}
                  isDefaultVisible={false}
                />
              </div>
            </Box>
          </Box>

          <Box className="h-full">
            <Grid container spacing={1}>
              <Grid item xs={12} md={6} lg={5} mt={0} className="card-content">
                <div className="flex w-full flex-col gap-4 bg-white p-4">
                  {filteredProjects?.length === 0 ? (
                    <h3
                      style={{ marginTop: "10rem" }}
                      className="font-semibold text-gray-400"
                    >
                      No projects available for this name or category.
                    </h3>
                  ) : (
                    filteredProjects?.map((project, index) => (
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
                        onClick={() =>
                          handleProjectCardClick(project?.project_id)
                        }
                      >
                        <div className="card-content-wrapper relative">
                          <p>
                            <span className="text-white">Project Name : </span>
                            {project.project_name}
                          </p>
                          <p>
                            <span className="text-white">
                              Project Category :
                            </span>{" "}
                            {project.category}
                          </p>
                          <p className="bg-yellowTag inline-block !text-background px-2 rounded-full w-[80px] text-center tex-sm absolute right-4">
                            {!project.is_owner && "Shared"}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Grid>

              <Grid xs={12} md={6} lg={7}>
                <p>
                  <span className="text-md font-semibold ms-2">Location</span>{" "}
                  {location}
                </p>
                <Box
                  className="header_map"
                  style={{ height: "h-auto", width: "98%" }}
                >
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
