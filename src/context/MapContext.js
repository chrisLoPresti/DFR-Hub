"use client"

import { errorToast, successToast } from "@/components/Toast";
import axios from "axios";
import { createContext, useEffect, useCallback, useContext, useState } from "react";
import { GoogleMap, useJsApiLoader, StandaloneSearchBox} from "@react-google-maps/api";
import { useGeolocated } from "react-geolocated";
import MapMarker from "@/components/maps/MapMarker";
import CreatePinPointButton from "@/components/maps/CreatePinPointButton";
import themeConfig from "@/../tailwind.config";
import classNames from "classnames";
import { MdOutlineDelete ,MdOutlineCenterFocusWeak } from "react-icons/md";
import { FaSpinner } from "react-icons/fa6";
import ColorButtons from "@/components/maps/ColorButtons";

export const MapContext = createContext({
  markers: [],
  loading: false,
});

export const useMapContext = () => useContext(MapContext);

export const markerColors = {
  blue: themeConfig.theme.extend.colors["blue-annotation"],
  yellow: themeConfig.theme.extend.colors["yellow-annotation"],
  purple: themeConfig.theme.extend.colors["purple-annotation"],
  green: themeConfig.theme.extend.colors["green-annotation"],
  red: themeConfig.theme.extend.colors["red-annotation"],
};

export const MapContextProvider = ({ children }) => {
  //context export states
  const [markers, setMarkers] = useState([]);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const[selectedMapMarker, setSelectedMapMarker] = useState(null);
  //context map object to be shared
  const [map, setMap] = useState(null);
   //context center point of the map to be shared
  const [center, setCenter] = useState(null);
  //context map pin colors
  const [defaultMarkerColor, setDefaultMarkerColor] = useState("blue");

  const createNewMapMarker = useCallback(
    async (marker) => {
      try {
        setLoading(true);
        setErrors(null);

        const res = await axios.post(
          "https://nj.unmannedlive.com/dfr/newcall",
          {
            ...marker,
            lat: marker.position.lat,
            lon: marker.position.lng,
            z: "10.5",
            elementid: "a0eebed4-0c5e-4e3a-a8db-dbf7829e8d76",
            workspaceid: "b0eebed4-0c5e-4e3a-a8db-dbf7829e8dd8",
            sn: "1581F5BKD223Q00A520F",
          },
          {
            withCredentials: false,
          }
        );
      if(res.status === 201){
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/map-annotations/marker`,
          marker
        );
        successToast(`Successfully created Map Marker: ${data.name}!`);
        setMarkers([...markers, data]);
        return data;
      } else {
        errorToast(`Unable to create map marker: ${marker.name}`);
      }

        
      } catch (error) {
        setLoading(false);
        errorToast(`Unable to create map marker: ${marker.name}`);
        return { error };
      }
    },
    [setErrors, setLoading, markers]
  );

  const deleteMapMarker = useCallback(
    async (marker) => {
      try {
        setLoading(true);
        setErrors(null);

        
  const { data } = await axios.delete(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/map-annotations/marker`,
    {data: {marker}}
  );
  successToast(`Successfully deleted Map Marker: ${marker.name}`);
  setMarkers([...markers.filter(({ name }) => name !== marker.name)]);
  return data;

        
      } catch (error) {
        setLoading(false);
        return { error };
      }
    },
    [setErrors, setLoading, markers]
  );

  const getAllMapMarkers = useCallback(async () => {
    try {
      setLoading(true);
      setErrors(null);
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/map-annotations/marker`
      );

      setMarkers(data);
      return newMarker;
    } catch (error) {
      setLoading(false);
      return { error };
    }
  }, [setErrors, setLoading]);

  
  const createMarker = useCallback( async ({ latLng, name , color}) => {
    const marker =  await createNewMapMarker({
        name: name || `new pin ${new Date().toLocaleString()}`,// `new pin ${uuidv4()}`,
        position: {
          lat: latLng.lat(),
          lng: latLng.lng(),
        },
        color,
      });
      if(marker._id){
        map.getBounds().contains(latLng)
        map.panTo(latLng)
        setSelectedMapMarker(marker);
      }
  }, [map,createNewMapMarker]);

  const deleteMarker = useCallback(() => {
    const index = markers.findIndex(({ name }) => name === selectedMapMarker.name);
    deleteMapMarker(selectedMapMarker);
    markers.splice(index, 1);
    setSelectedMapMarker(null);
    setMarkers([...markers]);
  }, [selectedMapMarker, markers])

  const selectMapMarker = useCallback((index) => () => {
    if(index !== null){
    setCenter(markers[index].position);
    setSelectedMapMarker(markers[index])
    } else {
      setSelectedMapMarker(null);
    }
  },[markers])


const changeDefaultMarkerColor = (color) => () => {
    setDefaultMarkerColor(color);
  };

  useEffect(() => {
    getAllMapMarkers();
  }, []);

  return (
    <MapContext.Provider
      value={{
       markers, setMarkers,
      errors, setErrors,
      loading, setLoading,
      selectedMapMarker, setSelectedMapMarker,
      map, setMap,
      center, setCenter,
      defaultMarkerColor, changeDefaultMarkerColor,
      createMarker,
      deleteMarker,
      selectMapMarker
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

const libraries = ["places"];

const containerStyle = {
  width: "100%",
  height: "100%",
};

export const Map = () => {
 const [searchBox, setSearchBox] = useState(null);
  const [enablePinPoints, setEnablePinPoints] = useState(false);
  const [mapTypeId, setMapTypeId] = useState(null);


    const { map, createMarker, deleteMarker, markers , center, setCenter, setMap, selectedMapMarker, selectMapMarker, defaultMarkerColor, changeDefaultMarkerColor} = useMapContext();
 
    const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API || "",
    libraries
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
  
  const onAddressFound = useCallback((e) => {
    const address = searchBox.getPlaces();

  createMarker({ name:address[0].name,  latLng: address[0].geometry.location , color: defaultMarkerColor });
  },[searchBox,createMarker, defaultMarkerColor]);

  const dropMarker = useCallback(({ latLng }) => {

  createMarker({ latLng, color: defaultMarkerColor });
  },[createMarker, defaultMarkerColor]);

  const recenterMap = () => {
    map.setCenter(selectedMapMarker?.position);
  }

  const storeMapTypeId = useCallback(() => {
    const newMapTypeId = map?.getMapTypeId() || localStorage.getItem('mapTypeId');
    localStorage.setItem("mapTypeId", newMapTypeId);
    setMapTypeId(newMapTypeId)
  }, [map]);

  useEffect(() => {
      setCenter({
        lat: coords?.latitude,
        lng: coords?.longitude,
      });
    }, [coords]);

useEffect( ()=>{
  const storedMapTypeId =  localStorage.getItem('mapTypeId') || 'hybrid';
  setMapTypeId(storedMapTypeId);
},[])
 
  return <MapContextProvider>
   {isLoaded && center && mapTypeId ?  <div className="relative w-full h-full flex">
      {/* isLoaded && center */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={1}
        onLoad={onMapLoad}
        onUnmount={onUnmount}
        onClick={enablePinPoints ? dropMarker : null}
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
              type='text'
              placeholder='Search for an address'
              className="overflow-ellipses outline-none w-96 h-27 absolute top-2.5 p-2 rounded-sm shadow-lg right-2 z-20"
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
              selectMapMarker={selectMapMarker}
              selectedMapMarker={selectedMapMarker}
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
       <div className={classNames('p-5 bg-tertiary w-80 flex flex-col gap-y-2', {'hidden invisible ': !selectedMapMarker})}>
          <div className="flex">
            <label className='text-white' htmlFor='selected-marker-name'>Selected Map Marker</label>
           <div className="flex items-center justify-center gap-x-2 ml-2">
             <button 
                data-tooltip-id="tooltip"
                data-tooltip-content=" Recenter"
                onClick={recenterMap}
           >
              <MdOutlineCenterFocusWeak  className="text-white text-xl"/>
            </button>
            <button
                data-tooltip-id="tooltip"
                data-tooltip-content=" Delete"
                onClick={deleteMarker}
            >
              <MdOutlineDelete className="text-white text-xl"/>
            </button>
           </div>
          </div>
          <input id="selected-marker-name" type="text" value={selectedMapMarker?.name} className='w-full shadow-inner text-sm p-2 rounded-sm'/>
          <ColorButtons color={selectedMapMarker?.color} className="bg-transparent"/>
          <div className="text-sm w-full flex flex-col gap-y-2">
            <div className="flex items-center w-full justify-between">
              <p className="w-1/3 text-white"> Longitude:</p>  <input type="text" value={selectedMapMarker?.position?.lng} className='w-2/3 p-2 shadow-inner text-sm rounded-sm'/>
            </div>
              <div className="flex items-center w-full justify-between">
              <p className="w-1/3 text-white"> Latitude: </p> <input type="text" value={selectedMapMarker?.position?.lat} className='w-2/3 p-2 shadow-inner text-sm rounded-sm'/>
              </div>
                <hr className="my-2"/>
             <div className="text-white">
                <p className="mb-2">Created By:</p>
              <p>{selectedMapMarker?.created_by?.name}</p>
                <p>{selectedMapMarker?.created_by?.email}</p>
          </div>
             </div>
        </div>
    </div>
   : 
    <div className="flex w-full h-full items-center justify-center gap-3">
      <FaSpinner  className="animate-spin h-5 w-5"/>
     <p>Processing...</p>
  </div>}
  </MapContextProvider>
}





export default MapContext;
