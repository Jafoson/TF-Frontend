import Image from "next/image";
import React from "react";
import styles from "./LogoWrapper.module.scss";

interface LogoWrapperProps {
  logoUrl: string | null;
  teamName: string;
}

function LogoWrapper({ logoUrl, teamName }: LogoWrapperProps) {
  return (
    <div className={styles.logoWrapperContainer}>
      <Image
        className={styles.logo}
        src={logoUrl || "/placeholder/logo/placeholder_logo_dark.png"}
        alt={teamName + " Logo"}
        width={100}
        height={100}
      />
      <h2>{teamName}</h2>
    </div>
  );
}

export default LogoWrapper;
