import { useState } from "react";
import { InfoWindow, Marker } from "@react-google-maps/api";
import themeConfig from "@/../tailwind.config";

const MapMarker = ({ lat, lng, name, deleteMarker, color, index }) => {
  const [showInfowWindow, setShowInfoWindow] = useState(false);
  const [position, setPosition] = useState({ lat, lng });

  const closeInfoWindow = () => {
    setShowInfoWindow(false);
  };

  const openInfoWindow = () => {
    setShowInfoWindow(true);
  };

  const updatePosition = ({ latLng }) => {
    const newLat = latLng.lat();
    const newLng = latLng.lng();
    setPosition({ lat: newLat, lng: newLng });
  };

  return (
    <Marker
      position={position}
      markerId={name}
      // onClick={onMarkerClick} // you need to manage this prop on your Marker component!
      draggable={true}
      // onDragStart={(e, { latLng }) => {}}
      // onDrag={(e, { latLng }) => {}}
      onDragEnd={updatePosition}
      onClick={openInfoWindow}
      icon={{
        path: "M456.225,244.286L270.989,7.314C267.382,2.7,261.857,0,255.999,0c-5.856,0-11.381,2.7-14.989,7.314 L55.775,244.286c-5.378,6.884-5.378,16.544,0,23.428l185.236,236.972c3.608,4.616,9.132,7.314,14.989,7.314 c5.858,0,11.383-2.698,14.99-7.314l185.236-236.972C461.603,260.83,461.603,251.17,456.225,244.286z M255.999,477.522L82.84,256 L255.999,34.478L429.17,256L255.999,477.522z",
        // fillColor: "blue-annotation",
        // fillOpacity: 1,
        strokeWeight: 4,
        strokeColor: themeConfig.theme.extend.colors[`${color}-annotation`],
        rotation: 0,
        scale: 0.07,
        anchor: new google.maps.Point(258, 500),
      }}
      label={{
        text: name,
        color: "white",
        fontSize: "18px",
        className: "ml-14 mb-8",
      }}
    >
      {showInfowWindow && (
        <InfoWindow onCloseClick={closeInfoWindow}>
          <div>
            <p>name: {name}</p>
            <p>latitude: {position.lat}</p>
            <p>longitude: {position.lng}</p>
            <button
              className="bg-red-500 text-white shadow p-2 rounded-md mt-2 w-full text-center"
              onClick={deleteMarker(index)}
            >
              delete
            </button>
          </div>
        </InfoWindow>
      )}
    </Marker>
  );
};

export default MapMarker;
