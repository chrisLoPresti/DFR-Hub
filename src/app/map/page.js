import { MapProvider } from "@/providers/map-provider";

export default function Home() {

  return (
    <MapProvider>
      <main>
        Map will come here
      </main>
    </MapProvider>
  );
}