import { createContext, useContext, useState, useCallback } from 'react'

const AccessibilityContext = createContext()

const THEMES = {
  highContrast: 'theme-high-contrast',
  colorblind: 'theme-colorblind',
  dyslexia: 'theme-dyslexia',
  reducedMotion: 'theme-reduced-motion',
  largeText: 'theme-large-text',
}

export function AccessibilityProvider({ children }) {
  const [activeThemes, setActiveThemes] = useState({
    highContrast: false,
    colorblind: false,
    dyslexia: false,
    reducedMotion: false,
    largeText: false,
  })

  const toggle = useCallback((key) => {
    setActiveThemes((prev) => ({ ...prev, [key]: !prev[key] }))
  }, [])

  const themeClasses = Object.entries(activeThemes)
    .filter(([, active]) => active)
    .map(([key]) => THEMES[key])
    .join(' ')

  return (
    <AccessibilityContext.Provider value={{ activeThemes, toggle, themeClasses }}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  return useContext(AccessibilityContext)
}
