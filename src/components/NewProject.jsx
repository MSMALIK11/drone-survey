import React, { useEffect, useState, useRef, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../style/newproject.css";
import api from "../services";
import Loading from "../shared/Loading";
import CompoBox from "./ui/CompoBox";
import InputControl from "./ui/InputControl";
import TextareaControl from "./ui/TextareaControl";
import PrimaryButton from "../shared/PrimaryButton";
const NewProject = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);

  const [lng, setLng] = useState(78.9629);
  const [lat, setLat] = useState(20.5937);
  const [zoom, setZoom] = useState(4);

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isLocationEditable, setIsLocationEditable] = useState(false);

  const handleNavigationHome = () => {
    navigate("/");
  };

  const [formData, setFormData] = useState({
    name: "",
    latitude: "",
    longitude: "",
    category: "solar",
    description: "",
    project_status: "",
    location: "",
    progress:""
  });

  const [locationName, setLocationName] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.dashboardApi.getallCategory();
        if (response.status === 201) {
          setCategories(response.data);
        } else {
          throw new Error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));

      // Check the textField if empty disabled the button
      const anyFieldEmpty = Object.values({
        ...formData,
        [name]: value,
      }).some((value) => value === "");
      setIsButtonDisabled(anyFieldEmpty);
    },
    [formData]
  );

  const handleCategoryChange = (value, name) => {
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };
  const handleLatitudeChange = (e) => {
    const { value } = e.target;
    setLat(parseFloat(value) || 0);

    setFormData((prevFormData) => ({
      ...prevFormData,
      latitude: value,
    }));
  };

  const handleLongitudeChange = (e) => {
    const { value } = e.target;
    setLng(parseFloat(value) || 0);

    setFormData((prevFormData) => ({
      ...prevFormData,
      longitude: value,
    }));
  };

  const getReverseGeocode = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=pk.eyJ1IjoicmF3YXRhbW1pZSIsImEiOiJjbG5rNzgzN28wandvMnFwMm1qbWduZ25hIn0.zjWDLv9gL6YI1uIIwPgA7A`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.features && data.features.length > 0) {
          const placeName = data.features[0].place_name;
          return placeName;
        }
      }

      return null;
    } catch (error) {
      console.error("Error fetching reverse geocode:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setLoading(true);
    try {
      const response = await api.dashboardApi.addProject(formData);
      if (response.status == 201) {
        toast.success("Project added successfully");
        navigate("/");
        // Reset all form fields
        setFormData({
          project_name: "",
          category: "",
          description: "",
          history: "",
          location: "",
          status: "true",
          latitude: "",
          longitude: "",
        });

        setLat(0);
        setLng(0);
        setIsLocationEditable(false);
      } else {
        throw new Error("Failed to send data");
      }
    } catch (error) {
      console.error("Error sending data:", error);

      // Show error notification
      toast.error("Failed to add project");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoicmF3YXRhbW1pZSIsImEiOiJjbG5rNzgzN28wandvMnFwMm1qbWduZ25hIn0.zjWDLv9gL6YI1uIIwPgA7A";

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    });

    const zoomControls = new mapboxgl.NavigationControl();
    map.current.addControl(zoomControls, "top-right");

    marker.current = new mapboxgl.Marker({ color: "red", draggable: true })
      .setLngLat([lng, lat])
      .addTo(map.current);

    const handleMapClick = (e) => {
      const { lng, lat } = e.lngLat;

      // Update the marker position
      marker.current.setLngLat([lng, lat]);

      // Update the latitude and longitude state
      setLng(lng);
      setLat(lat);

      // Update the form data
      setFormData((prevFormData) => ({
        ...prevFormData,
        latitude: lat.toString(),
        longitude: lng.toString(),
      }));

      // Fetch the location name using reverse geocoding
      getReverseGeocode(lat, lng).then((locationName) => {
        setLocationName(locationName || "Location not found");
      });
      map.current.setCenter([lng, lat]);
    };

    // Attach the click event listener to the map container
    map.current.on("click", handleMapClick);

    const handleMarkerDragEnd = (e) => {
      const { lng, lat } = e.target.getLngLat();
      setLng(lng);
      setLat(lat);
      setFormData((prevFormData) => ({
        ...prevFormData,
        latitude: lat.toString(),
        longitude: lng.toString(),
      }));
      setIsLocationEditable(true);
      getReverseGeocode(lat, lng).then((locationName) => {
        setLocationName(locationName || "Location not found");
      });
      map.current.setCenter([lng, lat]);
    };
    marker.current.on("dragend", handleMarkerDragEnd);

    return () => {
      // Cleanup function to remove the map when the component is unmounted
      map.current.remove();
    };
  }, []);

  const mapContainerStyle = {
    position: "relative",
  
    width: "100%",
    height: "80vh",
    borderRadius: "20px",
    marginLeft: "20px",
  };
  const isDisabled =
    !formData.name ||
    !formData.category ||
    !formData.latitude ||
    !formData.longitude;

  return (
    <>
      <Box className="newproject_header">
        <Box
          className="newproject_header_right"
          style={{ paddingLeft: "20px" }}
        >
          <h4 className="pro_heading">New Project</h4>
          <p style={{ fontSize: "12px", color: "#b0b0b0" }}>
            Enter project details and organize better with BotLab Dynamics
          </p>
        </Box>
        <Box
          className="newproject_header_left"
          style={{ paddingRight: "20px" }}
        >
          <Button
            onClick={handleNavigationHome}
            startIcon={<ArrowBackIcon />}
            variant="contained"
            style={{
              fontFamily: "sans-serif",
              fontWeight: "bold",
              fontSize: "12px",
              backgroundColor: "#1c213e",
              padding: "4px 12px",
              borderRadius: "30px",
            }}
            className="ProjectBtn"
          >
            Back TO Project
          </Button>
        </Box>
      </Box>
      <div
        className="newproject_head mt-4 p-4"
        
      >
        <Grid container style={{ backgroundColor: "#F5F6FF" }}>
          <Grid item lg={5}>
            <Box className="relative overflow-hidden newProjectFormWrapper ">
              <div className="left-form-wraper  overflow-auto p-5 flex flex-col gap-5">
                
             
              <InputControl
                name={"name"}
                placeholder={"Project Name"}
                value={formData.project_name}
                onChange={handleChange}
              />
              <CompoBox
                selectLabel={"category_name"}
                selectValue={"category_name"}
                onChange={handleCategoryChange}
                options={categories}
                name="category"
               

              />
              <TextareaControl
                name="description"
                placeholder="Project Description (Optional)"
                value={formData.description}
                onChange={handleChange}
              />
              <InputControl
                disabled
                name="latitude"
                placeholder="Latitude"
                value={formData.latitude}
                onChange={handleLatitudeChange}
                helperText="  Drag the marker on the map to set the Latitude*"
              />

              <InputControl
                disabled
                placeholder="Longitude"
                name="longitude"
                value={formData.longitude}
                onChange={handleLongitudeChange}
                helperText="Drag the marker on the map to set the Longitude*"
              />
              <InputControl
                placeholder="Longitude"
                name="longitude"
                value={formData.longitude}
                onChange={handleLongitudeChange}
                disabled
                helperText="Drag the marker on the map to set the Longitude*"
              />

              <InputControl
                placeholder="Location Name"
                value={locationName}
                disabled
                helperText="Drag the marker on the map to set the Location Name*"
              />
               </div>
              <div className="absolute w-full bottom-0 left-0 p-5 bg-white">
                <div className="w-full form-container">
                <PrimaryButton onClick={handleSubmit} isLoading={loading} disabled={isDisabled} label={"Create New Project"} />
                 
                </div>
              </div>
    
            </Box>
          </Grid>

          <Grid item lg={7}>
            <Box className="Right_map">
              <p
                style={{
                  marginLeft: "50px",
                  fontSize: "14px",
                  fontFamily: "sans-serif",
                }}
              >
                Select Project Location
              </p>

              <Box className="map_content " style={{ marginTop: "10px" }}>
                <div style={mapContainerStyle} ref={mapContainer} />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </div>
      <Loading isVisible={loading} />
    </>
  );
};

export default NewProject;
