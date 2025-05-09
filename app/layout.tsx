import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import Providers from "./providers";
import { UserProvider } from "@/app/context/UserContext";
import "./globals.css";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
})

export const metadata: Metadata = {
  title: "Nitro",
  description: "Your one stop platform for microloans onchain",
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
        <Providers>
          <UserProvider>
          {children}
          <Toaster />
          </UserProvider>
        </Providers>
      </body>
    </html>
  );
}
