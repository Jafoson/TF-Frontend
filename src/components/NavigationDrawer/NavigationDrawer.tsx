"use client";

import React from "react";
import IconButton from "../IconButton/IconButton";
import {
  CloseIcon,
  ControllerIcon,
  EventIcon,
  HomeIcon,
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
import { DiscordLogo, XLogo } from "@/assets/icons/logos";
import { MailIcon } from "@/assets/icons";
import { Link } from "@/i18n/navigation";

function NavigationDrawer() {
  const t = useTranslations("navigationDrawer");
  return (
    <div className={styles.navigationDrawer}>
      <div className={styles.navigationDrawerContent}>
        <div className={styles.navigationDrawerHeader}>
          <IconButton icon={CloseIcon} variant="text" onClick={() => {}} />
          <Image
            className={styles.navigationDrawerHeaderLogo}
            src="/logo/tf_logo_dark.svg"
            alt="logo"
            width={158}
            height={48}
          />
        </div>
        <DrawerTabs t={t} />
        <div className={styles.navigationDrawerFooter}>
          <Tab
            title={t("settings")}
            icon={OutlineSettingsIcon}
            activeIcon={SettingsIcon}
            href="/settings"
          />
          <div className={styles.navigationDrawerFooterIcons}>
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
          <div className={styles.navigationDrawerFooterText}>
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

const DrawerTabs = ({ t }: { t: any }) => {
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
      href: "/games",
    },
    {
      title: "matches",
      icon: OutlineSwordIcon as React.FC<React.SVGProps<SVGSVGElement>>,
      activeIcon: SwordIcon as React.FC<React.SVGProps<SVGSVGElement>>,
      href: "/matches",
    },
    {
      title: "teams",
      icon: OutlineTeamIcon as React.FC<React.SVGProps<SVGSVGElement>>,
      activeIcon: TeamIcon as React.FC<React.SVGProps<SVGSVGElement>>,
      href: "/teams",
    },
    {
      title: "events",
      icon: OutlineEventIcon as React.FC<React.SVGProps<SVGSVGElement>>,
      activeIcon: EventIcon as React.FC<React.SVGProps<SVGSVGElement>>,
      href: "/events",
    },
  ];

  return (
    <nav className={styles.navigationDrawerTabs}>
      {tabs.map((tab) => (
        <Tab
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
