import React, { useEffect, useState } from "react";
import styles from "./TopBar.module.scss";
import IconButton from "@/components/atoms/IconButton/IconButton";
import { MenuIcon, MoonIcon, SunIcon, SunMoonIcon } from "@/assets/icons";
import Button from "@/components/atoms/Button/Button";
import { useTranslations } from "next-intl";
import { useTitle } from "@/context/TitleContext";
import { useTheme } from "@/context/ThemeContext";
import PopUp from "../../PopUp/PopUp";

function TopBar({ setIsOpen }: { setIsOpen: (isOpen: boolean) => void }) {
  const { mode, setMode } = useTheme();
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
        <PopUp>
          <PopUp.Trigger>
            <IconButton
              icon={
                mode === "light"
                  ? SunIcon
                  : mode === "dark"
                  ? MoonIcon
                  : SunMoonIcon
              }
              variant="text"
              iconSize={32}
              onClick={() => {}}
            />
          </PopUp.Trigger>
          <PopUp.Container minWidth={"fit-content"} width={"fit-content"}>
            <PopUp.Property
              icon={MoonIcon}
              onClick={() => setMode("dark")}
              selected={mode === "dark"}
            >
              {t("dark")}
            </PopUp.Property>
            <PopUp.Property
              icon={SunIcon}
              onClick={() => setMode("light")}
              selected={mode === "light"}
            >
              {t("light")}
            </PopUp.Property>
            <PopUp.Property
              icon={SunMoonIcon}
              onClick={() => setMode("system")}
              selected={mode === "system"}
            >
              {t("system")}
            </PopUp.Property>
          </PopUp.Container>
        </PopUp>
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
