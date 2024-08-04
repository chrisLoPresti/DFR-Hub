"use client";

import { signOut } from "next-auth/react";
import { TbMapPin2 } from "react-icons/tb";
import { BiLogOut } from "react-icons/bi";
import { usePathname  } from "next/navigation";
import classNames from "classnames";
import {  useMapContext } from "@/context/MapContext";
import Checkbox from "react-custom-checkbox";
import { TbDiamonds } from "react-icons/tb";

const SideNavigation = () => {

  const pathName = usePathname();
  const { markers, selectMapMarker, selectedMapMarker } = useMapContext();


  const handleLogout = () => {
    signOut({ callbackUrl: "/", redirect: true });
  };


  return (
    <div className="h-full bg-tertiary text-white shadow-lg flex flex-col justify-between border-t-2 border-neutral-700"> 
        <div className="flex h-full">
    <ul className="border-r-2 w-2/12 border-neutral-700 h-full flex flex-col items-center justify-center">
      <button className={classNames("w-full hover:text-blue-annotation flex items-center justify-center p-3", {
         'bg-white bg-opacity-10': pathName.includes("map-annotations")
      })}
         data-tooltip-id="tooltip"
           data-tooltip-content="Map Annotations">
        <TbMapPin2   className={classNames("text-2xl", {  'text-blue-annotation': pathName.includes("map-annotations")})}/>
      </button>
        <button
          className={"w-full hover:text-blue-annotation flex items-center justify-center mt-auto p-3"}
          onClick={handleLogout}
           data-tooltip-id="tooltip"
           data-tooltip-content="Log Out"
        >
          <BiLogOut  className="text-2xl"/>
        </button>
    </ul>
    <div className="h-full w-10/12 flex flex-col truncate">
    <p className="my-5 ml-5">Map Annotations</p>
    {markers?.map(({ name, position }, index) => <div key={name} className={classNames("flex justify-left items-center gap-x-2 text-xl py-2 cursor-pointer p-5", { 
      'bg-white bg-opacity-10': selectedMapMarker?.name === name
    } )} onClick={selectMapMarker(index)}>
       <Checkbox className="border-white" borderColor="white" size={16}/>
       <TbDiamonds  />
      <p className="overflow-hidden text-ellipsis text-sm">
      {name}
      </p>
      </div>)}
      
    </div>
</div>
    </div>
  );
};



export default SideNavigation;
