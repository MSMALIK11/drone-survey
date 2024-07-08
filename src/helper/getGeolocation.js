export const getGeolocation = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${process.env.REACT_APP_MAP_API_KEY}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.features && data.features.length > 0) {
          const placeName = data.features[3].place_name;
          return placeName;
        }
      }

      return null;
    } catch (error) {
      console.error("Error fetching geolocation:", error);
      return null;
    }
  };