import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import Providers from "./providers";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Nitro",
  description: "An AI Integrated Web3 Micrloan Platform Built for Borrowers and Lenders ",
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
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
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
