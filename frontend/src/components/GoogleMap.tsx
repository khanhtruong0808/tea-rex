import React from "react";
import {
  GoogleMap as GoogleMapApi,
  LoadScript,
  Marker,
} from "@react-google-maps/api";
import { config } from "../config";

interface GoogleMapProps {
  width?: string;
}

const storeLoc = {
  lat: 38.40948371588517,
  lng: -121.47864745092666,
};

const mark = new Marker({
  position: storeLoc,
  title: "Tea-Rex",
});

const showInMapClicked = () => {
  window.open(
    "https://www.google.com/maps/place/Tea+Rex/@38.4093492,-121.4811902,17z/data=!3m1!4b1!4m6!3m5!1s0x809ac8efe05de4f3:0x43044f5f27b8ce91!8m2!3d38.409345!4d-121.4786099!16s%2Fg%2F11b6_k79zm",
  );
};

const GoogleMap: React.FC<GoogleMapProps> = ({ width }) => {
  const defaultContainerStyle = {
    width: "50%",
    height: "500px",
  };

  const mergedContainerStyle = {
    ...defaultContainerStyle,
    width: width || defaultContainerStyle.width,
  };

  return (
    <LoadScript googleMapsApiKey={config.googleMapsApiKey}>
      <GoogleMapApi
        mapContainerStyle={mergedContainerStyle}
        center={storeLoc}
        zoom={17}
      >
        <Marker
          position={storeLoc}
          title={"Tea-Rex"}
          onClick={showInMapClicked}
        />
      </GoogleMapApi>
    </LoadScript>
  );
};

export default GoogleMap;
