"use client"

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
  } from 'react'
  
  type ThemeMode = 'system' | 'light' | 'dark'
  type EffectiveTheme = 'light' | 'dark'
  
  const THEME_STORAGE_KEY = 'tournamentfox.theme.mode'
  
  interface ThemeContextProps {
    mode: ThemeMode
    effectiveTheme: EffectiveTheme
    setMode: (mode: ThemeMode) => void
  }
  
  const ThemeContext = createContext<ThemeContextProps>({
    mode: 'system',
    effectiveTheme: 'light',
    setMode: () => {},
  })
  
  export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [mode, setModeState] = useState<ThemeMode>('system')
    const [systemTheme, setSystemTheme] = useState<EffectiveTheme>('light')
  
    const getSystemTheme = (): EffectiveTheme =>
      window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  
    const setMode = (newMode: ThemeMode) => {
      setModeState(newMode)
      localStorage.setItem(THEME_STORAGE_KEY, newMode)
    }
  
    // apply theme to <html>
    const applyThemeClass = (theme: EffectiveTheme) => {
      document.documentElement.classList.remove('light', 'dark')
      document.documentElement.classList.add(theme)
    }
  
    useEffect(() => {
      // Load from localStorage or default to system
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null
      setModeState(saved || 'system')
  
      const updateSystemTheme = () => {
        const sysTheme = getSystemTheme()
        setSystemTheme(sysTheme)
      }
  
      updateSystemTheme() // initial
      const media = window.matchMedia('(prefers-color-scheme: dark)')
      media.addEventListener('change', updateSystemTheme)
  
      return () => {
        media.removeEventListener('change', updateSystemTheme)
      }
    }, [])
  
    // Update HTML class on mode or system change
    useEffect(() => {
      const effective: EffectiveTheme = mode === 'system' ? systemTheme : mode
      applyThemeClass(effective)
    }, [mode, systemTheme])
  
    const effectiveTheme: EffectiveTheme = mode === 'system' ? systemTheme : mode
  
    return (
      <ThemeContext.Provider value={{ mode, effectiveTheme, setMode }}>
        {children}
      </ThemeContext.Provider>
    )
  }
  
  export const useTheme = () => useContext(ThemeContext)