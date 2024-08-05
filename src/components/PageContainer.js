"use client";

import { Tooltip } from "react-tooltip";
import SideNavigation from "./side-navigation/SideNavigation";
import ToastProvider from "@/providers/toast-provider";
import { MapContextProvider } from "@/context/MapContext";
import { useSession } from "next-auth/react";
import { DeviceContextProvider } from "@/context/DeviceContext";
import { Suspense } from "react";

const PageContainer = ({ children }) => {
  const { data: session } = useSession();
  return (
    <>
      <header className="sticky top-0">
        <div className="bg-tertiary w-full h-12 shadow-lg flex items-cente p-2">
          <p className="text-white ml-auto w-content">{session?.user?.name}</p>
        </div>
      </header>
      <MapContextProvider>
        <DeviceContextProvider>
          <ToastProvider>
            <div className="flex h-[calc(100vh_-_48px)] relative">
              <div className="w-80">
                <Suspense>
                  <SideNavigation />
                </Suspense>
              </div>
              <div className="w-[calc(100vw_-_320px)]">{children}</div>
              <Tooltip id="tooltip" className="z-50" />
            </div>
          </ToastProvider>
        </DeviceContextProvider>
      </MapContextProvider>
    </>
  );
};

export default PageContainer;
