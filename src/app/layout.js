import { Inter } from "next/font/google";
import "./globals.css";
import { Provider } from "./Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DFR Hub",
  description: "DFR Hub App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Provider>
            <body className={inter.className}>
              {children}
            </body>
      </Provider>
    </html>
  );
}
