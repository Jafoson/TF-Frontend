'use client'

import React from 'react'
import PopUp from '../PopUp'
import IconButton from '@/components/atoms/IconButton/IconButton'
import { MoonIcon, SunIcon, SunMoonIcon } from '@/assets/icons'
import { useTheme } from '@/context/ThemeContext';
import { useTranslations } from 'next-intl';
import Tab from './ProfilPopUp/atoms/tab/Tab'

interface ThemeSwitcherProps {
  isExpanded: boolean;
}


function ThemeSwitcher({ isExpanded = false }: ThemeSwitcherProps) {
  const { mode, setMode } = useTheme();
  const t = useTranslations("topBar");

  const icon = mode === "light" ? SunIcon : mode === "dark" ? MoonIcon : SunMoonIcon;

  const ThemeSwitcherVariant = () => {
    if (isExpanded) {
      return <Tab title={t(`${mode}`)} icon={icon} />
    }
    return <IconButton
      icon={icon}
      variant="text"
      iconSize={32}
      onClick={() => {}}
    />
  }
  return (
    <PopUp placement={isExpanded ? "left" : "bottom"} offset={9}>
          <PopUp.Trigger >
            <ThemeSwitcherVariant />
          </PopUp.Trigger>
          <PopUp.Container  minWidth={"max-content"} width={"max-content"}>
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
  )
}

export default ThemeSwitcher