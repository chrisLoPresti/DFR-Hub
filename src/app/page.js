"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// import Link from "next/link";
// import { signOut } from "next-auth/react";
// import { MapComponent } from "@/components/Map";

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  if (status === "authenticated") {
    router.push("/map-annotations");
  } else {
    router.push("/login");
  }

  // const showSession = () => {
  //   if (status === "authenticated") {
  //     return (
  //      <>
  //       <button
  //         className="text-[#888] text-sm text-999 mt-7 transition duration-150 ease hover:text-white"
  //         onClick={() => {
  //           signOut();
  //         }}
  //       >
  //         Logout here
  //       </button>
  //       <MapComponent/>
  //       </>
  //     )
  //   } else if (status === "loading") {
  //     return (
  //       <span className="text-[#888] text-sm mt-7">Loading...</span>
  //     )
  //   } else {
  //     return (
  //       <Link
  //         href="/login"
  //         className="text-[#888] text-sm text-999 mt-7 transition duration-150 ease hover:text-white"
  //       >
  //         Login here
  //       </Link>
  //     )
  //   }
  // }
  // return (
  //   <main className="flex min-h-screen flex-col items-center justify-center">
  //     <h1 className="text-xl">NextAuth APP</h1>
  //     {showSession()}
  //   </main>
  // );
}
