import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import Providers from "./providers";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
})

export const metadata: Metadata = {
  title: "Nitro",
  description: "Your one stop platform for microloans onchain",
  icons: "/logo.svg"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${nunitoSans.className} antialiased`}
      >
        {/* <Providers> */}
          <Header/>
          {children}
          <Footer/>
        {/* </Providers> */}
      </body>
    </html>
  );
}
