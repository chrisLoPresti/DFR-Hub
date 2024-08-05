"use client";

import { useEffect, useCallback, useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  StandaloneSearchBox,
} from "@react-google-maps/api";
import { useGeolocated } from "react-geolocated";
import MapMarker from "@/components/maps/MapMarker";
import CreatePinPointButton from "@/components/maps/CreatePinPointButton";
import classNames from "classnames";
import { MdOutlineDelete, MdOutlineCenterFocusWeak } from "react-icons/md";
import { FaSpinner } from "react-icons/fa6";
import ColorButtons from "@/components/maps/ColorButtons";
import { IoCloseOutline } from "react-icons/io5";
import { useMapContext } from "@/context/MapContext";

const libraries = ["places"];

const containerStyle = {
  width: "100%",
  height: "100%",
};

export const Map = () => {
  const [searchBox, setSearchBox] = useState(null);
  const [enablePinPoints, setEnablePinPoints] = useState(false);
  const [mapTypeId, setMapTypeId] = useState(null);

  const {
    map,
    createMarker,
    deleteMarker,
    markers,
    center,
    loading,
    setCenter,
    setMap,
    elevator,
    setElevator,
    selectedMapMarker,
    selectMapMarker,
    defaultMarkerColor,
    changeDefaultMarkerColor,
    updateMapMarker,
  } = useMapContext();

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API || "",
    libraries,
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
    const newElevator = new google.maps.ElevationService();
    setElevator(newElevator);
  }, []);

  const onSearchBoxLoad = useCallback((newSearchBox) => {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    // const bounds = new window.google.maps.LatLngBounds(center);
    // map.fitBounds(bounds);
    setSearchBox(newSearchBox);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
    setElevator(null);
  }, []);

  const toggleEnablePinPoints = () => {
    if (enablePinPoints) {
      map.setOptions({ draggableCursor: "" });
    } else {
      map.setOptions({ draggableCursor: "crosshair" });
    }
    setEnablePinPoints(!enablePinPoints);
  };

  const onAddressFound = useCallback(
    (e) => {
      const address = searchBox.getPlaces();

      createMarker({
        name: address[0].name,
        latLng: address[0].geometry.location,
        color: defaultMarkerColor,
      });
    },
    [searchBox, createMarker, defaultMarkerColor]
  );

  const dropMarker = useCallback(
    ({ latLng }) => {
      if (enablePinPoints && !loading) {
        createMarker({ latLng, color: defaultMarkerColor });
      }
    },
    [createMarker, defaultMarkerColor, enablePinPoints, loading]
  );

  const recenterMap = () => {
    map.setCenter(selectedMapMarker?.position);
  };

  const storeMapTypeId = useCallback(() => {
    const newMapTypeId = map?.getMapTypeId() ?? mapTypeId;
    if (newMapTypeId !== mapTypeId) {
      localStorage.setItem("mapTypeId", newMapTypeId);
      setMapTypeId(newMapTypeId);
    }
  }, [map, mapTypeId]);

  const updateSelectedMarkerColor = useCallback(
    (color) => () => {
      updateMapMarker({ ...selectedMapMarker, color });
    },
    [selectedMapMarker, updateMapMarker]
  );

  useEffect(() => {
    setCenter({
      lat: coords?.latitude,
      lng: coords?.longitude,
    });
  }, [coords, setCenter]);

  useEffect(() => {
    const storedMapTypeId = localStorage?.getItem("mapTypeId") ?? "hybrid";
    setMapTypeId(storedMapTypeId);
  }, []);

  return isLoaded && mapTypeId ? (
    <div className="relative w-full h-full flex">
      {/* isLoaded && center */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={1}
        onLoad={onMapLoad}
        onUnmount={onUnmount}
        onClick={dropMarker}
        onMapTypeIdChanged={storeMapTypeId}
        options={{
          fullscreenControl: false,
          mapTypeId: mapTypeId,
          rotateControl: true,
          streetViewControl: false,
          // disableDefaultUI: true
        }}
      >
        {/* Child components, such as markers, info windows, etc. */}
        <>
          <StandaloneSearchBox
            onPlacesChanged={onAddressFound}
            onLoad={onSearchBoxLoad}
          >
            <input
              type="text"
              placeholder="Search for an address"
              className="overflow-ellipses outline-none w-96 h-27 absolute top-2.5 p-2 rounded-sm shadow-lg right-2 z-20"
            />
          </StandaloneSearchBox>
          {markers.map((marker, index) => (
            <MapMarker
              key={marker._id}
              marker={marker}
              index={index}
              elevator={elevator}
              selectMapMarker={selectMapMarker}
              selectedMapMarker={selectedMapMarker}
              updateMapMarker={updateMapMarker}
            />
          ))}
          <CreatePinPointButton
            enablePinPoints={enablePinPoints}
            toggleEnablePinPoints={toggleEnablePinPoints}
            color={defaultMarkerColor}
            changeColor={changeDefaultMarkerColor}
          />
        </>
      </GoogleMap>
      <div
        className={classNames("px-5 bg-tertiary w-80 flex flex-col gap-y-2", {
          "hidden invisible ": !selectedMapMarker,
        })}
      >
        <div className="flex justify-center items-center">
          <label className="text-white" htmlFor="selected-marker-name">
            Selected Map Marker
          </label>
          <button
            onClick={selectMapMarker(null)}
            className="text-white ml-auto hover:bg-white hover:bg-opacity-10 rounded-full p-2"
          >
            <IoCloseOutline className="text-xl" />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <input
            id="selected-marker-name"
            type="text"
            value={selectedMapMarker?.name || "marker name..."}
            className="w-full shadow-inner text-sm p-2 rounded-sm"
          />
          <div className="flex items-center justify-center gap-x-2 ml-2">
            <button
              data-tooltip-id="tooltip"
              data-tooltip-content=" Recenter"
              onClick={recenterMap}
            >
              <MdOutlineCenterFocusWeak className="text-white text-xl" />
            </button>
            <button
              data-tooltip-id="tooltip"
              data-tooltip-content=" Delete"
              onClick={deleteMarker}
            >
              <MdOutlineDelete className="text-white text-xl" />
            </button>
          </div>
        </div>
        <ColorButtons
          color={selectedMapMarker?.color}
          changeColor={updateSelectedMarkerColor}
          className="bg-transparent"
        />
        <div className="text-sm w-full flex flex-col gap-y-2">
          <div className="flex items-center w-full justify-between">
            <p className="w-1/3 text-white"> Longitude:</p>
            <input
              type="text"
              value={selectedMapMarker?.position?.lng || "longitude..."}
              className="w-2/3 p-2 shadow-inner text-sm rounded-sm"
            />
          </div>
          <div className="flex items-center w-full justify-between">
            <p className="w-1/3 text-white"> Latitude: </p>
            <input
              type="text"
              value={selectedMapMarker?.position?.lat || "latitude..."}
              className="w-2/3 p-2 shadow-inner text-sm rounded-sm"
            />
          </div>
          <div className="flex items-center w-full justify-between">
            <p className="w-1/3 text-white"> Elevation: </p>
            <input
              type="text"
              value={selectedMapMarker?.position?.elevation || "elevation..."}
              className="w-2/3 p-2 shadow-inner text-sm rounded-sm"
            />
          </div>
          <hr className="my-2" />
          <div className="text-white">
            <p className="mb-2">Created By:</p>
            <p>{selectedMapMarker?.created_by?.name}</p>
            <p>{selectedMapMarker?.created_by?.email}</p>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex w-full h-full items-center justify-center gap-3">
      <FaSpinner className="animate-spin h-5 w-5" />
      <p>Processing...</p>
    </div>
  );
};
