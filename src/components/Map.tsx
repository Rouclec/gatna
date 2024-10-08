/* 
Since the map was loaded on client side, 
we need to make this component client rendered as well else error occurs
*/
"use client";

//Map component Component from library
import { GoogleMap } from "@react-google-maps/api";

//Map's styling
export const defaultMapContainerStyle = {
  width: "100%",
  height: "225px",
  borderRadius: "15px 15px 15px 15px",
};

const MapComponent = () => {
  const defaultMapCenter = {
    lat: 35.8799866,
    lng: 76.5048004,
  };

  const defaultMapOptions = {
    zoomControl: false,
    tilt: 0,
    gestureHandling: "auto",
    mapTypeId: "roadmap",
  };

  const defaultMapZoom = 5;

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
