import { useNavigate, useLocation } from 'react-router-dom'
import { LogOut, ArrowLeft } from 'lucide-react'
import { useApp } from '../context/AppContext'
import AccessibilityMenu from './AccessibilityMenu'

export default function TopNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useApp()

  const showKeepSwiping = location.pathname.startsWith('/chat')

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <nav className="top-nav">
      <div className="top-nav__left">
        <img src="/logo_text.png" alt="OpenHeart" className="top-nav__logo" />
      </div>

      <div className="top-nav__right">
        {showKeepSwiping && (
          <button className="btn-ghost" onClick={() => navigate('/swipe')}>
            <ArrowLeft size={18} />
            Keep Swiping
          </button>
        )}
        <AccessibilityMenu />
        <button className="btn-ghost" onClick={handleLogout}>
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </nav>
  )
}
