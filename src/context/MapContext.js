"use client";

import { errorToast, successToast } from "@/components/Toast";
import axios from "axios";
import {
  createContext,
  useEffect,
  useCallback,
  useContext,
  useState,
} from "react";
import themeConfig from "@/../tailwind.config";

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
  const [selectedMapMarker, setSelectedMapMarker] = useState(null);
  //context map object to be shared
  const [map, setMap] = useState(null);
  //context map elevationd data
  const [elevator, setElevator] = useState(null);
  //context center point of the map to be shared
  const [center, setCenter] = useState(null);
  //context map pin colors
  const [defaultMarkerColor, setDefaultMarkerColor] = useState("blue");

  const createNewMapMarker = useCallback(
    async (data) => {
      const { selectedDevice, ...marker } = data;
      try {
        setLoading(true);
        setErrors(null);

        const { results } = await elevator.getElevationForLocations({
          locations: [marker.position],
        });

        const elevation = results[0].elevation;

        const res = await axios.post(
          "https://nj.unmannedlive.com/dfr/newcall",
          {
            ...marker,
            lat: marker.position.lat,
            lon: marker.position.lng,
            z: elevation,
            workspaceid: selectedDevice.workspace_id,
            sn: selectedDevice.serial_number,
          },
          {
            withCredentials: false,
          }
        );
        if (res.status === 201) {
          const { data } = await axios.post(`/api/map-annotations/marker`, {
            ...marker,
            position: {
              ...marker.position,
              elevation,
            },
          });
          successToast(`Successfully created Map Marker: ${data.name}!`);
          setMarkers([...markers, data]);
          setLoading(false);
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
    [setErrors, setLoading, markers, elevator]
  );

  const deleteMapMarker = useCallback(
    async (marker) => {
      try {
        setLoading(true);
        setErrors(null);

        const { data } = await axios.delete(`/api/map-annotations/marker`, {
          data: { marker },
        });
        successToast(`Successfully deleted Map Marker: ${marker.name}`);
        setMarkers([...markers.filter(({ name }) => name !== marker.name)]);
        setLoading(false);
        return data;
      } catch (error) {
        setLoading(false);
        return { error };
      }
    },
    [setErrors, setLoading, markers]
  );

  const updateMapMarker = useCallback(
    async (marker) => {
      try {
        setLoading(true);
        setErrors(null);

        const { data: updatedMarker } = await axios.put(
          `/api/map-annotations/marker`,
          marker
        );
        successToast(`Successfully updated Map Marker: ${updatedMarker.name}`);

        const index = markers.findIndex(
          ({ name }) => name === updatedMarker.name
        );

        if (selectedMapMarker.name === updatedMarker.name) {
          setSelectedMapMarker(updatedMarker);
        }

        markers[index] = updatedMarker;
        setMarkers([...markers]);

        setLoading(false);
        return data;
      } catch (error) {
        setLoading(false);
        return { error };
      }
    },
    [
      setErrors,
      setLoading,
      markers,
      setMarkers,
      selectedMapMarker,
      setSelectedMapMarker,
    ]
  );

  const getAllMapMarkers = useCallback(async () => {
    try {
      setLoading(true);
      setErrors(null);
      const { data } = await axios.get(`/api/map-annotations/marker`);

      setMarkers(data);
      return newMarker;
    } catch (error) {
      setLoading(false);
      return { error };
    }
  }, [setErrors, setLoading]);

  const createMarker = useCallback(
    async ({ latLng, name, color, selectedDevice }) => {
      if (loading) {
        return;
      }
      const marker = await createNewMapMarker({
        name: name || `new pin ${new Date().toLocaleString()}`, // `new pin ${uuidv4()}`,
        position: {
          lat: latLng.lat(),
          lng: latLng.lng(),
        },
        color,
        selectedDevice,
      });
      if (marker._id) {
        map.getBounds().contains(latLng);
        map.panTo(latLng);
        setSelectedMapMarker(marker);
      }
    },
    [map, createNewMapMarker, loading]
  );

  const deleteMarker = useCallback(() => {
    if (loading) {
      return;
    }
    const index = markers.findIndex(
      ({ name }) => name === selectedMapMarker.name
    );
    deleteMapMarker(selectedMapMarker);
    markers.splice(index, 1);
    setSelectedMapMarker(null);
    setMarkers([...markers]);
  }, [selectedMapMarker, markers, deleteMapMarker, loading]);

  const selectMapMarker = useCallback(
    (index) => () => {
      if (index === null) {
        setSelectedMapMarker(null);
        return;
      }

      if (!selectedMapMarker || selectedMapMarker._id !== markers[index]._id) {
        setCenter(markers[index].position);
        setSelectedMapMarker(markers[index]);
      }
    },
    [markers, selectedMapMarker]
  );

  const changeDefaultMarkerColor = (color) => () => {
    setDefaultMarkerColor(color);
  };

  useEffect(() => {
    getAllMapMarkers();
  }, []);

  return (
    <MapContext.Provider
      value={{
        markers,
        setMarkers,
        errors,
        setErrors,
        loading,
        setLoading,
        selectedMapMarker,
        setSelectedMapMarker,
        map,
        setMap,
        elevator,
        setElevator,
        center,
        setCenter,
        defaultMarkerColor,
        changeDefaultMarkerColor,
        createMarker,
        deleteMarker,
        selectMapMarker,
        updateMapMarker,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export default MapContext;
