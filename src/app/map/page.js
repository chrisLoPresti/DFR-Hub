"use client";

import { Map } from "@/components/maps/Map";
import PageContainer from "@/components/PageContainer";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const MappAnnotations = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/map?tab=annotations");
  }, []);
  return (
    <PageContainer>
      <Map />
    </PageContainer>
  );
};

export default MappAnnotations;
