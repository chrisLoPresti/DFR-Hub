"use client";

import { createContext, useContext, useState } from "react";

export const DeviceContext = createContext({
  devices: [],
  selectedDevice: null,
});

export const useDeviceContext = () => useContext(DeviceContext);

export const DeviceContextProvider = ({ children }) => {
  const devices = [
    {
      serial_number: "1581F5BKD225500BKP32",
      workspace_id: "030bef84-d797-4393-a07f-d9719a3833d2",
      ntfy: "terrestrial-uas",
      agency: "terrestrial-IainWaldrum",
      device: "Matrice 30T",
      image: "/images/drones/matrice_30t.png",
    },
    {
      serial_number: "1581F5FJC246400D146B",
      workspace_id: "000d2480-4b6b-11ef-9df9-073b7feb06da",
      ntfy: "terrestrial-uas",
      agency: "terrestial-Mario3T",
      device: "Mavic 3 Thermal",
      image: "/images/drones/mavic_3t.png",
    },
    {
      serial_number: "1581F5BKD223Q00A520F",
      workspace_id: "030a6a94-3c84-11ef-8ace-570f0d051196",
      ntfy: "terrestrial-uas",
      agency: "terrestrial-ChrisM30T",
      device: "Matrice 30T",
      image: "/images/drones/matrice_30t.png",
    },
    {
      serial_number: "1581F5BKB243100F016R",
      workspace_id: "030b94f4-09c2-480a-9faa-21c10971828d",
      ntfy: "UnmannedAR-raptor",
      agency: "unmannedar-chrisM30T",
      device: "Matrice 30T",
      image: "/images/drones/matrice_30t.png",
    },
    {
      serial_number: "1581F5FJD228K00A0294",
      workspace_id: "030edf4e-63f8-4a86-bd5c-32965ec038eb",
      ntfy: "terrestrial-uas",
      agency: "terrestrial-ChrisM30T",
      device: "Matrice 30T",
      image: "/images/drones/matrice_30t.png",
    },
  ];

  const [selectedDevice, setSelectedDevice] = useState(devices[1]);

  const selectDevice = (index) => () => {
    setSelectedDevice(devices[index]);
  };

  return (
    <DeviceContext.Provider
      value={{
        devices,
        selectedDevice,
        selectDevice,
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
};

export default DeviceContext;
