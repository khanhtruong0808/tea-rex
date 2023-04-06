import React from "react";
import { GoogleMap as GoogleMapApi, LoadScript } from "@react-google-maps/api";

const containerStyle = {
  width: "50%",
  height: "400px",
};

const center = {
  lat: 38.40953413760819,
  lng: -121.4786259953363,
};

const GoogleMap: React.FC = () => {
  return (
    <LoadScript googleMapsApiKey="AIzaSyCqgP43SARskbuxpyajGacfm304krkUmBE">
      <GoogleMapApi mapContainerStyle={containerStyle} center={center} zoom={10}>
        {/* Add markers or other map elements here */}
      </GoogleMapApi>
    </LoadScript>
  );
};

export default GoogleMap;