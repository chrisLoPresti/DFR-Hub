"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Home = () => {
  const { session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/map");
    }
  }, []);

  return <div>home</div>;
};

export default Home;
