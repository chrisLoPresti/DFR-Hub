import { useState } from "react";
import {  Marker } from "@react-google-maps/api";
import themeConfig from "@/../tailwind.config";
import classNames from "classnames";
import { markerColors } from "@/context/MapContext";

const MapMarker = ({ lat, lng, name, color, index, selectMapMarker,selectedMapMarker }) => {
  const [position, setPosition] = useState({ lat, lng });

  const updatePosition = ({ latLng }) => {
    const newLat = latLng.lat();
    const newLng = latLng.lng();
    setPosition({ lat: newLat, lng: newLng });
  };
  return (
    <Marker
      position={position}
      markerId={name}
      draggable={true}
      onDragEnd={updatePosition}
      onClick={selectMapMarker(index)}
      icon={{
        path: "M456.225,244.286L270.989,7.314C267.382,2.7,261.857,0,255.999,0c-5.856,0-11.381,2.7-14.989,7.314 L55.775,244.286c-5.378,6.884-5.378,16.544,0,23.428l185.236,236.972c3.608,4.616,9.132,7.314,14.989,7.314 c5.858,0,11.383-2.698,14.99-7.314l185.236-236.972C461.603,260.83,461.603,251.17,456.225,244.286z M255.999,477.522L82.84,256 L255.999,34.478L429.17,256L255.999,477.522z",
        strokeWeight: 4,
        strokeColor: themeConfig.theme.extend.colors[`${color}-annotation`],
        rotation: 0,
        scale: 0.07,
        anchor: new google.maps.Point(258, 500),
      }}
      label={{
        text:name,
        color:  'white',
        fontSize: "18px",
        className: classNames("ml-8 shadow-xl", {
          [`bg-${color}-annotation rounded-md p-1 mb-10`]: selectedMapMarker?.name === name,
          ['drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] mb-8 ']: selectedMapMarker?.name !== name
        })
      }}
    />
  );
};

export default MapMarker;
