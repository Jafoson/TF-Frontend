"use client";

import NavigationDrawer from "@/components/NavigationDrawer/NavigationDrawer";
import styles from "./layout.module.scss";
import "./layout.scss";
import { useState } from "react";
import TopBar from "@/components/Topbar/TopBar/TopBar";
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className={styles.container}>
        <NavigationDrawer isOpen={isOpen} setIsOpen={setIsOpen} />
        <div className={styles.content}>
          <TopBar setIsOpen={setIsOpen} />
          {children}
        </div>
      </div>
    </>
  );
}
