/* 
Since the map was loaded on client side, 
we need to make this component client rendered as well else error occurs
*/
"use client";

//Map component Component from library
import { GoogleMap, useJsApiLoader, StandaloneSearchBox} from "@react-google-maps/api";
import { useCallback, useEffect, useState } from "react";
import { useGeolocated } from "react-geolocated";
import MapMarker from "./MapMarker";
import CreatePinPointButton from "./CreatePinPointButton";
import themeConfig from "@/../tailwind.config";
import {
  MapAnnotationProvider,
  useMapAnnotationContext,
} from "@/context/MapAnnotationContext";
import { v4 as uuidv4 } from 'uuid';

const markerColors = {
  blue: themeConfig.theme.extend.colors["blue-annotation"],
  yellow: themeConfig.theme.extend.colors["yellow-annotation"],
  purple: themeConfig.theme.extend.colors["purple-annotation"],
  green: themeConfig.theme.extend.colors["green-annotation"],
  red: themeConfig.theme.extend.colors["blue-annotation"],
};

//Map's styling
const containerStyle = {
  width: "100%",
  height: "100%",
};

const MapComponent = () => {
  const [map, setMap] = useState(null);
  const [searchBox, setSearchBox] = useState(null);
  const [center, setCenter] = useState(null);
  const [enablePinPoints, setEnablePinPoints] = useState(false);
  const [defaultMarkerColor, setDefaultMarkerColor] = useState("blue");

  const { markers, setMarkers, createNewMapMarker, getAllMapMarkers ,deleteMapMarker } =
    useMapAnnotationContext();

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API || "",
    libraries: ["places"]
  });

  const { coords } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: Infinity,
    },
    watchPosition: false,
    userDecisionTimeout: null,
    suppressLocationOnMount: false,
    // geolocationProvider: navigator.geolocation,
    isOptimisticGeolocationEnabled: true,
    watchLocationPermissionChange: false,
  });

  const onMapLoad = useCallback((map) => {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    // const bounds = new window.google.maps.LatLngBounds(center);
    // map.fitBounds(bounds);
    map.setZoom(15);
    setMap(map);
  }, []);

  const onSearchBoxLoad = useCallback((newSearchBox) => {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    // const bounds = new window.google.maps.LatLngBounds(center);
    // map.fitBounds(bounds);
    setSearchBox(newSearchBox);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const toggleEnablePinPoints = () => {
    if (enablePinPoints) {
      map.setOptions({ draggableCursor: "" });
    } else {
      map.setOptions({ draggableCursor: "crosshair" });
    }
    setEnablePinPoints(!enablePinPoints);
  };

  const createMarker = useCallback( async ({ latLng }) => {
  const marker =  await createNewMapMarker({
      name: `new pin ${uuidv4()}`,
      position: {
        lat: latLng.lat(),
        lng: latLng.lng(),
      },
      color: defaultMarkerColor,
    });

    if(marker._id){
      map.getBounds().contains(latLng)
      map.panTo(latLng)
    }
  }, [map]);

  const deleteMarker = (index) => () => {
    deleteMapMarker(markers[index]);
    markers.splice(index, 1);
    setMarkers([...markers]);
  };

  const changeDefaultMarkerColor = (color) => () => {
    setDefaultMarkerColor(color);
  };

  const onAddressFound = useCallback((e) => {
const address = searchBox.getPlaces();

createMarker({ latLng: address[0].geometry.location });
},[searchBox]);

  useEffect(() => {
    setCenter({
      lat: coords?.latitude,
      lng: coords?.longitude,
    });
  }, [coords]);

  useEffect(() => {
    getAllMapMarkers();
  }, []);

  return isLoaded && center ? (
    <div className="relative w-full h-full">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={1}
        onLoad={onMapLoad}
        onUnmount={onUnmount}
        onClick={enablePinPoints ? createMarker : null}
        options={{
          fullscreenControl: false,
          mapTypeId: "satellite",
          rotateControl: true
        }}
      >
        {/* Child components, such as markers, info windows, etc. */}
        <>
        <StandaloneSearchBox
         onPlacesChanged={onAddressFound} 
         onLoad={onSearchBoxLoad}
         >
            <input
              type='text'
              placeholder='Search for an address'
              className="overflow-ellipses outline-none w-96 h-27 absolute top-2.5 p-2 rounded-sm shadow-lg right-2"
            />
          </StandaloneSearchBox>
          {markers.map(({ position: { lat, lng }, name, color }, index) => (
            <MapMarker
              key={name}
              lat={lat}
              lng={lng}
              name={name}
              color={color}
              index={index}
              deleteMarker={deleteMarker}
            />
          ))}
        </>
      </GoogleMap>
      <CreatePinPointButton
        enablePinPoints={enablePinPoints}
        toggleEnablePinPoints={toggleEnablePinPoints}
        markerColors={markerColors}
        defaultMarkerColor={defaultMarkerColor}
        changeDefaultMarkerColor={changeDefaultMarkerColor}
      />
    </div>
  ) : (
    <></>
  );
};

const MapWithContext = (props) => {
  return (
    <MapAnnotationProvider>
      <MapComponent {...props} />
    </MapAnnotationProvider>
  );
};

export default MapWithContext;
