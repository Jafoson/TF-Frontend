import React, { useEffect, useState } from "react";
import styles from "./TopBar.module.scss";
import IconButton from "@/components/atoms/IconButton/IconButton";
import { MenuIcon } from "@/assets/icons";
import Button from "@/components/atoms/Button/Button";
import { useTranslations } from "next-intl";
import { useTitle } from "@/context/TitleContext";

function TopBar({ setIsOpen }: { setIsOpen: (isOpen: boolean) => void }) {
  const { title } = useTitle();
  const [windowWidth, setWindowWidth] = useState(0);
  const t = useTranslations("topBar");
  useEffect(() => {
    // Initial window width setzen
    setWindowWidth(window.innerWidth);

    // Event listener für Resize hinzufügen
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div className={styles.topBar}>
      <IconButton
        className={styles.topBarMenuIcon}
        icon={MenuIcon}
        variant="text"
        iconSize={32}
        onClick={() => setIsOpen(true)}
      />
      <h1>{title}</h1>
      <div className={styles.topBarRight}>
        <Button
          isLink
          variant={windowWidth < 600 ? "filled" : "outlined"}
          size="small"
          title={t("login")}
          href="/login"
        />
        <Button
          isLink
          variant="filled"
          size="small"
          title={t("register")}
          className={styles.topBarRegisterButton}
          href="/register"
        />
      </div>
    </div>
  );
}

export default TopBar;
