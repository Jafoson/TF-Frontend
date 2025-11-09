"use client";

import NavigationDrawer from "@/components/layout/NavigationDrawer/NavigationDrawer";
import styles from "./layout.module.scss";
import { useState } from "react";
import TopBar from "@/components/layout/Topbar/TopBar/TopBar";
import { TitleProvider } from "@/context/TitleContext";
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <body className={styles.body}>
      <div className={styles.container}>
        <TitleProvider>
          <NavigationDrawer isOpen={isOpen} setIsOpen={setIsOpen} />
          <div className={styles.content}>
            <TopBar setIsOpen={setIsOpen} />
            {children}
          </div>
        </TitleProvider>
      </div>
    </body>
  );
}
