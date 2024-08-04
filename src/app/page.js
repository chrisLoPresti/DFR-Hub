"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function Home() {
  const { status } = useSession();
  const router = useRouter();

useEffect(() => {
  if (status === "authenticated") {
    router.push("/map-annotations");
  } else {
    router.push("/login");
  }
},[])

  return <div></div>
}
