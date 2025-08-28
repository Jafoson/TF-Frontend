"use client";

import React, { useEffect, useState } from "react";
import IconButton from "@/components/atoms/IconButton/IconButton";
import {
  ControllerIcon,
  EventIcon,
  HomeIcon,
  MenuIcon,
  OutlineControllerIcon,
  OutlineEventIcon,
  OutlineHomeIcon,
  OutlineSettingsIcon,
  OutlineSwordIcon,
  OutlineTeamIcon,
  SettingsIcon,
  SwordIcon,
  TeamIcon,
} from "@/assets/icons";
import Image from "next/image";
import Tab from "./atoms/Tab";
import { useTranslations } from "next-intl";
import styles from "./NavigationDrawer.module.scss";
import { DiscordLogo, TFLogo, XLogo } from "@/assets/icons/logos";
import { MailIcon } from "@/assets/icons";
import { Link } from "@/i18n/navigation";

interface NavigationDrawerProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

function NavigationDrawer({
  isOpen = false,
  setIsOpen,
}: NavigationDrawerProps) {
  const t = useTranslations("navigationDrawer");
  const [windowWidth, setWindowWidth] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Initial window width setzen
    setWindowWidth(window.innerWidth);

    // isExpanded State aus localStorage wiederherstellen
    const savedExpanded = localStorage.getItem("navigationDrawerExpanded");
    if (savedExpanded !== null) {
      setIsExpanded(JSON.parse(savedExpanded));
    }

    // Event listener für Resize hinzufügen
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Markiere als geladen
    setIsLoaded(true);

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // isExpanded State im localStorage speichern, wenn er sich ändert
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(
        "navigationDrawerExpanded",
        JSON.stringify(isExpanded)
      );
    }
  }, [isExpanded, isLoaded]);

  // Rendere nichts, bis der Component geladen ist
  if (!isLoaded) {
    return null;
  }

  return (
    <div
      className={styles.navigationDrawer}
      data-expanded={isExpanded}
      data-open={isOpen}
    >
      <div className={styles.navigationDrawerContent} data-open={isOpen}>
        <div
          className={styles.navigationDrawerHeader}
          data-expanded={isExpanded}
          data-open={isOpen}
        >
          <IconButton
            icon={
              windowWidth > 1024
                ? isExpanded
                  ? MenuIcon
                  : TFLogo
                : isOpen
                ? MenuIcon
                : TFLogo
            }
            iconSize={32}
            variant={"text"}
            onClick={() => {
              if (window.innerWidth > 1024) {
                setIsExpanded(!isExpanded);
              } else {
                setIsOpen(!isOpen);
              }
            }}
          />
          <Image
            data-expanded={isExpanded}
            data-open={isOpen}
            className={styles.navigationDrawerHeaderLogo}
            src="/logo/tf_logo_dark.svg"
            alt="logo"
            width={158}
            height={48}
          />
        </div>
        <DrawerTabs t={t} isOpen={isOpen} isExpanded={isExpanded} />
        <div className={styles.navigationDrawerFooter}>
          <Tab
            isExpanded={isExpanded}
            isOpen={isOpen}
            title={t("settings")}
            icon={OutlineSettingsIcon}
            activeIcon={SettingsIcon}
            href="/settings"
          />
          <div
            className={styles.navigationDrawerFooterIcons}
            data-expanded={isExpanded}
            data-open={isOpen}
          >
            <IconButton
              icon={XLogo}
              variant="filled"
              onClick={() => {
                window.open("https://x.com/Tournamentfox", "_blank");
              }}
            />
            <IconButton
              icon={MailIcon}
              variant="filled"
              onClick={() => {
                window.open("mailto:tournamentfox@gmail.com");
              }}
            />
            <IconButton
              icon={DiscordLogo}
              variant="filled"
              onClick={() => {
                window.open("https://discord.gg/uANRbpRzpc", "_blank");
              }}
            />
          </div>
          <div
            className={styles.navigationDrawerFooterText}
            data-expanded={isExpanded}
            data-open={isOpen}
          >
            <Link href="/privacy-policy">{t("privacyPolicy")}</Link>
            <Link href="/imprint">{t("imprint")}</Link>
            <Link href="/terms-of-service">{t("termsOfService")}</Link>
            <span>©Tournamentfox {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const DrawerTabs = ({
  t,
  isOpen,
  isExpanded,
}: {
  t: (key: string) => string;
  isOpen: boolean;
  isExpanded: boolean;
}) => {
  const tabs = [
    {
      title: "home",
      icon: OutlineHomeIcon as React.FC<React.SVGProps<SVGSVGElement>>,
      activeIcon: HomeIcon as React.FC<React.SVGProps<SVGSVGElement>>,
      href: "/",
    },
    {
      title: "games",
      icon: OutlineControllerIcon as React.FC<React.SVGProps<SVGSVGElement>>,
      activeIcon: ControllerIcon as React.FC<React.SVGProps<SVGSVGElement>>,
      href: "/games/",
    },
    {
      title: "matches",
      icon: OutlineSwordIcon as React.FC<React.SVGProps<SVGSVGElement>>,
      activeIcon: SwordIcon as React.FC<React.SVGProps<SVGSVGElement>>,
      href: "/matches/",
    },
    {
      title: "teams",
      icon: OutlineTeamIcon as React.FC<React.SVGProps<SVGSVGElement>>,
      activeIcon: TeamIcon as React.FC<React.SVGProps<SVGSVGElement>>,
      href: "/teams/",
    },
    {
      title: "events",
      icon: OutlineEventIcon as React.FC<React.SVGProps<SVGSVGElement>>,
      activeIcon: EventIcon as React.FC<React.SVGProps<SVGSVGElement>>,
      href: "/events/",
    },
  ];

  return (
    <nav className={styles.navigationDrawerTabs}>
      {tabs.map((tab) => (
        <Tab
          isExpanded={isExpanded}
          isOpen={isOpen}
          key={tab.title}
          title={t(tab.title)}
          icon={tab.icon}
          activeIcon={tab.activeIcon}
          href={tab.href}
        />
      ))}
    </nav>
  );
};

export default NavigationDrawer;
