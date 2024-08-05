"use client";

import { signOut } from "next-auth/react";
import { TbDrone, TbMapPin2 } from "react-icons/tb";
import { BiLogOut } from "react-icons/bi";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import classNames from "classnames";
import Annotations from "./tabs/Annotations";
import Devices from "./tabs/Devices";

const SideNavigation = () => {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();

  const changeRoute = (tab) => () => {
    router.push(`${pathName}?tab=${tab}`);
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/", redirect: true });
  };

  return (
    <div className="h-full bg-tertiary text-white shadow-lg flex flex-col justify-between border-t-2 border-neutral-700">
      <div className="flex h-full">
        <ul className="border-r-2 w-2/12 border-neutral-700 h-full flex flex-col items-center justify-center">
          <button
            className={classNames(
              "w-full hover:text-blue-annotation flex items-center justify-center p-3",
              {
                "bg-white bg-opacity-10":
                  searchParams.get("tab") === "annotations",
              }
            )}
            data-tooltip-id="tooltip"
            data-tooltip-content="Map Annotations"
            onClick={changeRoute("annotations")}
          >
            <TbMapPin2
              className={classNames("text-2xl", {
                "text-blue-annotation":
                  searchParams.get("tab") === "annotations",
              })}
            />
          </button>
          <button
            className={classNames(
              "w-full hover:text-blue-annotation flex items-center justify-center p-3",
              {
                "bg-white bg-opacity-10": searchParams.get("tab") === "devices",
              }
            )}
            data-tooltip-id="tooltip"
            data-tooltip-content="Devices"
            onClick={changeRoute("devices")}
          >
            <TbDrone
              className={classNames("text-2xl", {
                "text-blue-annotation": searchParams.get("tab") === "devices",
              })}
            />
          </button>
          <button
            className={
              "w-full hover:text-blue-annotation flex items-center justify-center mt-auto p-3"
            }
            onClick={handleLogout}
            data-tooltip-id="tooltip"
            data-tooltip-content="Log Out"
          >
            <BiLogOut className="text-2xl" />
          </button>
        </ul>
        <div className="h-full w-10/12 overflow-auto scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-slate-700 scrollbar-track-tertiary scrollbar-thin">
          <Annotations visible={searchParams.get("tab") === "annotations"} />
          <Devices visible={searchParams.get("tab") === "devices"} />
        </div>
      </div>
    </div>
  );
};

export default SideNavigation;
