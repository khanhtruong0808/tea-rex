import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

interface MapProps {
  width?: string;
}

const storeLoc = {
  lat: 38.40948371588517,
  lng: -121.47864745092666,
};

const customIcon = new L.Icon({
  iconUrl: "tea-rex-logos/tearex.webp",
  iconSize: [90, 95],
  iconAnchor: [30, 65],
  popupAnchor: [-3, -76],
});

const showInMapClicked = () => {
  window.open(
    "https://www.google.com/maps/place/Tea+Rex/@38.4093492,-121.4811902,17z/data=!3m1!4b1!4m6!3m5!1s0x809ac8efe05de4f3:0x43044f5f27b8ce91!8m2!3d38.409345!4d-121.4786099!16s%2Fg%2F11b6_k79zm",
  );
};

const Map: React.FC<MapProps> = ({ width }) => {
  const defaultContainerStyle = {
    width: "100%",
    height: "500px",
  };

  const mergedContainerStyle = {
    ...defaultContainerStyle,
    width: width || defaultContainerStyle.width,
  };

  const InvalidateSize: React.FC = () => {
    const map = useMap();

    useEffect(() => {
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }, []);

    return null;
  };

  return (
    <MapContainer
      center={storeLoc}
      zoom={17}
      scrollWheelZoom={false}
      style={{
        height: mergedContainerStyle.height,
        width: mergedContainerStyle.width,
        zIndex: 1,
      }}
    >
      <InvalidateSize />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker
        position={storeLoc}
        eventHandlers={{
          click: showInMapClicked,
        }}
        icon={customIcon}
      ></Marker>
    </MapContainer>
  );
};

export default Map;
