"use client"

import "./globals.css";
import "@/style/dark.scss"
import "@/style/light.scss"
import { ThemeProvider } from "@/context/ThemeContext";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ThemeProvider>
        <body>
          {children}
        </body>
      </ThemeProvider>
    </html>
  );
}
