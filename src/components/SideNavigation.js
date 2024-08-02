"use client";

import { signOut } from "next-auth/react";

const SideNavigation = () => {
  const handleLogout = () => {
    signOut({ callbackUrl: "/", redirect: true });
  };

  return (
    <div className="h-full w-72 bg-tertiary text-white shadow-lg p-5">
      <div className="w-full h-full flex flex-col bg-tertiary sticky-bottom-0">
        <button
          className="bg-primary w-full rounded-md hover:bg-opacity-60 mt-auto inline p-2"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default SideNavigation;
