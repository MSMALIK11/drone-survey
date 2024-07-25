import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

const DemoMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);

  const [lng, setLng] = useState(78.9629);
  const [lat, setLat] = useState(20.5937);
  const [zoom, setZoom] = useState(4);

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoicmF3YXRhbW1pZSIsImEiOiJjbG5rNzgzN28wandvMnFwMm1qbWduZ25hIn0.zjWDLv9gL6YI1uIIwPgA7A";

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    });

    // Add zoom controls
    const zoomControls = new mapboxgl.NavigationControl();
    map.current.addControl(zoomControls, "top-right");

    marker.current = new mapboxgl.Marker({ color: "red" })
      .setLngLat([lng, lat])
      .addTo(map.current);

    // Add a click event listener to update the marker location
    const handleMapClick = (e) => {
      const { lng, lat } = e.lngLat;
      setLng(lng);
      setLat(lat);
      marker.current.setLngLat([lng, lat]);
    };

    map.current.on("click", handleMapClick);

    // Cleanup
    return () => {
      map.current.off("click", handleMapClick);
      map.current.remove();
    };
  }, [lng, lat, zoom]);

  const mapContainerStyle = {
    position: "relative",
    top: "0%",
    bottom: "0%",
    width: "90%",
    height: "57vh",
    borderRadius: "20px",
    marginLeft: "50px",
    marginTop: "-10px",
  };

  return <div style={mapContainerStyle} ref={mapContainer} />;
};

export default DemoMap;
