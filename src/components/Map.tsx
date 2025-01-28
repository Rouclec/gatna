/* 
Since the map was loaded on client side, 
we need to make this component client rendered as well else error occurs
*/
"use client";

//Map component Component from library
import { GoogleMap, Libraries, useJsApiLoader } from "@react-google-maps/api";

// Define a list of libraries to load from the Google Maps API
const libraries = ["places", "drawing", "geometry"];

//Map's styling
export const defaultMapContainerStyle = {
  width: "100%",
  height: "225px",
  borderRadius: "15px 15px 15px 15px",
};

const MapComponent = () => {
  const defaultMapCenter = {
    lat: 7.3697,
    lng: 12.3547,
  };

  const defaultMapOptions = {
    zoomControl: false,
    tilt: 0,
    gestureHandling: "auto",
    mapTypeId: "roadmap",
  };

  const defaultMapZoom = 6;

  // Load the Google Maps JavaScript API asynchronously
  const { isLoaded: scriptLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API!,
    libraries: libraries as Libraries,
  });

  if (loadError) {
    console.log({ loadError }, "script loading error");
    return <p>Encountered error while loading google maps</p>;
  }

  if (!scriptLoaded) return <p>Map Script is loading ...</p>;

  return (
    <div className="w-full">
      <GoogleMap
        mapContainerStyle={defaultMapContainerStyle}
        center={defaultMapCenter}
        zoom={defaultMapZoom}
        options={defaultMapOptions}
      ></GoogleMap>
    </div>
  );
};

export { MapComponent };
