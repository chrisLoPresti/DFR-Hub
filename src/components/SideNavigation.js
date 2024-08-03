"use client";

import { signOut } from "next-auth/react";
import { TbMapPin2 } from "react-icons/tb";
import { BiLogOut } from "react-icons/bi";
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import { usePathname  } from "next/navigation";
import classNames from "classnames";
import {  useMapAnnotationContext } from "@/context/MapAnnotationContext";
import Checkbox from "react-custom-checkbox";
import { TbDiamonds } from "react-icons/tb";

const SideNavigation = () => {

  const pathName = usePathname();
  const { markers } = useMapAnnotationContext();


  const handleLogout = () => {
    signOut({ callbackUrl: "/", redirect: true });
  };

  return (
    <div className="h-full bg-tertiary text-white shadow-lg flex flex-col justify-between border-t-2 border-neutral-700"> 
<Tooltip id="side-navigation-tooltip"/>
<div className="flex h-full">
    <ul className="border-r-2 w-2/12 border-neutral-700 h-full flex flex-col items-center justify-center">
      <button className={classNames("w-full hover:text-blue-annotation flex items-center justify-center p-3", {
         'bg-white bg-opacity-10': pathName.includes("map-annotations")
      })}
         data-tooltip-id="side-navigation-tooltip"
           data-tooltip-content="Map Annotations">
        <TbMapPin2   className={classNames("text-2xl", {  'text-blue-annotation': pathName.includes("map-annotations")})}/>
      </button>
        <button
          className={"w-full hover:text-blue-annotation flex items-center justify-center mt-auto p-3"}
          onClick={handleLogout}
           data-tooltip-id="side-navigation-tooltip"
           data-tooltip-content="Log Out"
        >
          <BiLogOut  className="text-2xl"/>
        </button>
    </ul>
    <div className="h-full w-10/12 flex flex-col truncate p-5">
    <p className="mb-5">Map Annotations</p>
    {markers.map(({ name }) => <div key={name} className="flex justify-left items-center gap-x-2 text-xl py-2 cursor-pointer">
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
