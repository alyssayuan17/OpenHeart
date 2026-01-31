import { useState, useRef, useEffect } from 'react'
import { Settings, Eye, Palette, BookOpen, Zap, Type } from 'lucide-react'
import { useAccessibility } from '../context/AccessibilityContext'

const OPTIONS = [
  { key: 'highContrast', label: 'High Contrast', icon: Eye },
  { key: 'colorblind', label: 'Colorblind Safe', icon: Palette },
  { key: 'dyslexia', label: 'Dyslexia Friendly', icon: BookOpen },
  { key: 'reducedMotion', label: 'Reduced Motion', icon: Zap },
  { key: 'largeText', label: 'Large Text', icon: Type },
]

export default function AccessibilityMenu() {
  const [open, setOpen] = useState(false)
  const { activeThemes, toggle } = useAccessibility()
  const menuRef = useRef()

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="a11y-menu" ref={menuRef}>
      <button
        className="btn-icon"
        onClick={() => setOpen(!open)}
        aria-label="Accessibility settings"
        title="Accessibility settings"
      >
        <Settings size={20} />
      </button>

      {open && (
        <div className="a11y-dropdown" role="menu">
          {OPTIONS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              className={`a11y-option ${activeThemes[key] ? 'active' : ''}`}
              onClick={() => toggle(key)}
              role="menuitemcheckbox"
              aria-checked={activeThemes[key]}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
