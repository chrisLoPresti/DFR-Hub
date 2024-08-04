"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  if (status === "authenticated") {
    router.push("/map-annotations");
  } else {
    router.push("/login");
  }

  return <div></div>
}
