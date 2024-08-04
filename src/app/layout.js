import { Inter } from "next/font/google";
import "./globals.css";
import { Provider } from "./Provider";
import { MapContextProvider } from "@/context/MapContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DFR Hub",
  description: "DFR Hub App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Provider>
        <MapContextProvider>
            <body className={inter.className}>
              {children}
            </body>
        </MapContextProvider>
      </Provider>
    </html>
  );
}
