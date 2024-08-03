import { errorToast, successToast } from "@/components/Toast";
import axios from "axios";
import { createContext, useCallback, useContext, useState } from "react";

export const MapAnnotationContext = createContext({
  markers: [],
  loading: false,
});

export const useMapAnnotationContext = () => useContext(MapAnnotationContext);

export const MapAnnotationProvider = ({ children }) => {
  const [markers, setMarkers] = useState([]);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);

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

  return (
    <MapAnnotationContext.Provider
      value={{
        loading,
        markers,
        setMarkers,
        createNewMapMarker,
        errors,
        getAllMapMarkers,
        deleteMapMarker
      }}
    >
      {children}
    </MapAnnotationContext.Provider>
  );
};

export default MapAnnotationContext;
