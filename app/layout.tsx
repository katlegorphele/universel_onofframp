import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";
import Header from "./components/Header";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Universel On-Offramp",
  description: "Send and receive money across borders",
  // icons: '/sqaureUlogo.png'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThirdwebProvider>
      <html lang="en">
        {/* <head>
          <link rel="icon" type="image/png" href="/squareUlogo.png" />
        </head> */}
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col justify-items-center items-center h-screen bg-[url('/backgroundSwirls.png')] bg-cover bg-center bg-no-repeat`}
        >
          <Header/>
          {children}
      
          
        </body>
      </html>
    </ThirdwebProvider>
  );
}
