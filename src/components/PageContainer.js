"use client"

import { Tooltip } from "react-tooltip";
import SideNavigation from "./SideNavigation";
import ToastProvider from "@/providers/toast-provider";

const PageContainer = ({ children }) => {
  return (
    <>
      <header className="sticky top-0">
        <div className="bg-tertiary w-full h-12 shadow-lg"></div>
      </header>
     <ToastProvider>
        <div className="flex h-[calc(100vh_-_48px)] relative">
        <div className="w-80">
          <SideNavigation />
        </div>
     <div className="w-[calc(100vw_-_320px)]">
         {children}
     </div>
      <Tooltip id="tooltip"/>
      </div>
     </ToastProvider>
    </>
  );
};

export default PageContainer;
