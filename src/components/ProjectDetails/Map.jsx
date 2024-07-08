import React, { useRef, useState ,useEffect} from 'react'
import mapboxgl from "mapbox-gl";
import { getGeolocation } from '../../helper/getGeolocation';
const mapContainerStyle = {
    position: "relative",
    top: "0%",
    bottom: "0%",
    width: "100%",
    height: "40vh",
    borderRadius: "20px",
    marginLeft: "10px",
    marginTop: "-10px",
  };
const Map = ({lat=78.9629,lng=20.5937,getPlaceName}) => {
      const mapContainer = useRef(null);
const [locationName,setLocationName]=useState("")
  const map = useRef(null);
  const markers = useRef([]);
  const [mapCenter, setMapCenter] = useState([lat,lng]);
//   const [lng, setLng] = useState(78.9629);
//   const [lat, setLat] = useState(20.5937);
  const [zoom, setZoom] = useState(17);

  const [defaultLng, setDefaultLng] = useState(78.9629);
  const [defaultLat, setDefaultLat] = useState(20.5937);
  const getPlacename=async()=>{
    const  placeName=await getGeolocation(lat,lng)
    getPlaceName(placeName)
    setLocationName(placeName)

  }
 
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
   
    getPlacename()
    return () => {
      markers.current.forEach((marker) => marker.remove());
      map.current.remove();
    };
  }, [lng, lat, zoom, defaultLng, defaultLat]);
    
  return (
    <div className='mt-12'>
        <div
                style={{ height: "auto", width: "99%" }}>
                <div style={mapContainerStyle} ref={mapContainer} />
              </div>
    </div>
  )
}

export default Map