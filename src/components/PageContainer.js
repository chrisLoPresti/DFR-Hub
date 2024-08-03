"use client"

import { MapAnnotationProvider } from "@/context/MapAnnotationContext";
import SideNavigation from "./SideNavigation";

const PageContainer = ({ children }) => {
  return (
    <>
      <header className="sticky top-0">
        <div className="bg-tertiary w-full h-12 shadow-lg"></div>
      </header>
     <MapAnnotationProvider>
       <div className="flex h-[calc(100vh_-_48px)] relative">
        <div className="w-80">
          <SideNavigation />
        </div>
     <div className="w-[calc(100vw_-_320px)]">
         {children}
     </div>
      </div>
     </MapAnnotationProvider>
    </>
  );
};

export default PageContainer;
