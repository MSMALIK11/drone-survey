import React, { useRef, useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import { getGeolocation } from "../../helper/getGeolocation";
const mapContainerStyle = {
  position: "relative",
  top: "0%",
  bottom: "0%",
  width: "800",
  height: "100%",
  borderRadius: "20px",
  marginLeft: "10px",
  // marginTop: "10px",
  flex: 1,
};
const Map = ({ lat = 78.9629, lng = 20.5937, getPlaceName }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);
  const [mapCenter] = useState([lat, lng]);
  const [zoom] = useState(17);

  const [defaultLng] = useState(78.9629);
  const [defaultLat] = useState(20.5937);
  const getPlacename = async () => {
    const placeName = await getGeolocation(lat, lng);
    getPlaceName(placeName);
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
    const markerLng = isNaN(lng) || lng < -180 || lng > 180 ? defaultLng : lng;
    const markerLat = isNaN(lat) || lat < -90 || lat > 90 ? defaultLat : lat;
    // Create a new marker object
    const newMarker = new mapboxgl.Marker({ color: "blue" })
      .setLngLat([markerLng, markerLat])
      .addTo(map.current);

    markers.current.push(newMarker);
    map.current.flyTo({
      center: [markerLng, markerLat],
      essential: true,
    });

    getPlacename();
    return () => {
      markers.current.forEach((marker) => marker.remove());
      map.current.remove();
    };
  }, [lng, lat, zoom, defaultLng, defaultLat]);

  return (
    <div className="mt-[22px]">
      <div style={{ height: "25vh", width: "99%" }}>
        <div style={mapContainerStyle} ref={mapContainer} />
      </div>
    </div>
  );
};

export default Map;
